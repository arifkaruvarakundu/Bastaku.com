from django.shortcuts import get_object_or_404, render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Campaign, CampaignParticipant
from .serializers import CampaignSerializer,CampaignListSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from wholesaler.models import Product, ProductVariant
from order.models import CampaignOrder,Payment,Notification
from decimal import Decimal
from django.db.models import Sum
from authentication.models import User
from rest_framework.exceptions import PermissionDenied
from django.utils.crypto import get_random_string
from django.db import transaction
from django.core.mail import EmailMessage
from django.conf import settings
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import decimal

# Create your views here.

class CampaignListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CampaignSerializer

    def get_queryset(self):
        # ✅ Prefetch participants to optimize DB queries
        return Campaign.objects.filter(is_active=True).prefetch_related('participants')

    def get_serializer_context(self):
        return {'request': self.request}

# class CampaignDetailView(generics.RetrieveAPIView):
#     permission_classes = [AllowAny]
#     queryset = Campaign.objects.all()
#     serializer_class = CampaignSerializer

class CampaignDetailView(generics.RetrieveAPIView):
    """
    Retrieve campaign details and check if the user has already joined.
    """
    permission_classes = [AllowAny]
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def get(self, request, *args, **kwargs):
        # Get the campaign object
        campaign = self.get_object()

        # Serialize campaign data
        serializer = self.get_serializer(campaign)

        # Check if the user has already joined
        has_joined = False
        
        if request.user.is_authenticated:
            has_joined = CampaignParticipant.objects.filter(
                campaign=campaign,
                user=request.user
            ).exists()

        # Include the `has_joined` field in the response
        response_data = serializer.data
        response_data['has_joined'] = has_joined

        return Response(response_data)

class JoinCampaignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        
        if request.user.is_anonymous:  # ✅ Explicit check
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            campaign = Campaign.objects.get(pk=pk)
        except Campaign.DoesNotExist:
            return Response({'error': 'Campaign not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the campaign has ended
        if campaign.has_ended():
            return Response({'error': 'Campaign has ended.'}, status=status.HTTP_400_BAD_REQUEST)

        variant = campaign.variant
        # Extract the participant's desired quantity from the request body
        participant_quantity = request.data.get('participant_quantity', 1)
        payment_amount = Decimal(request.data.get('payment_amount', 0))
        price = Decimal(variant.price)
        discount_percentage = Decimal(variant.campaign_discount_percentage)
        discounted_price_per_unit = price * (Decimal(1) - discount_percentage / Decimal(100))
        total_price = discounted_price_per_unit * Decimal(participant_quantity)

        # Determine required payment amount based on `payment_option`
        required_payment = Decimal(0)

        payment_option = request.data.get('payment_option')

        if payment_option == "free":
            required_payment = Decimal(0)
        elif payment_option == "10_percent":
            required_payment = total_price * Decimal(0.10)
        elif payment_option == "100_percent":
            required_payment = total_price

        # Validate if the provided payment amount matches the required payment
        if payment_amount < required_payment:
            return Response(
                {'error': f'Insufficient payment. Required: {required_payment:.2f}, Provided: {payment_amount:.2f}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure the participant's quantity is valid
        if int(participant_quantity) <= 0:
            return Response({'error': 'Participant quantity must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the user is already a participant
        participant = CampaignParticipant.objects.filter(campaign=campaign, user=request.user).first()
        if participant:
            # Update the existing participant's quantity
            participant.quantity = participant_quantity
            participant.save()
        else:
            # Add a new participant
            CampaignParticipant.objects.create(campaign=campaign, user=request.user, quantity=participant_quantity)

        # Recalculate the current quantity for the campaign
        campaign.current_quantity = CampaignParticipant.objects.filter(campaign=campaign).aggregate(
            total_quantity=Sum('quantity')
        )['total_quantity'] or 0

        campaign.save()

        # Check if campaign is ready to disperse
        if campaign.current_quantity >= campaign.variant.minimum_order_quantity_for_offer:
            self.disperse_campaign(campaign)

        return Response({'message': 'Successfully joined or updated the campaign!'}, status=status.HTTP_200_OK)


    def disperse_campaign(self, campaign):
        participants = campaign.participants.all()
        orders = []

        # Dynamically calculate the discounted price
        variant = campaign.variant
        if variant.campaign_discount_percentage is None or variant.price is None:
            raise ValueError("Product's actual price or discount percentage is not set.")

        # Convert actual_price and campaign_discount_percentage to Decimal for calculations
        price = Decimal(variant.price)
        discount_percentage = Decimal(variant.campaign_discount_percentage)
        discounted_price_per_unit = price * (Decimal(1) - discount_percentage / Decimal(100))

        total_campaign_quantity = Decimal(0)
        total_campaign_amount = Decimal(0)
        participant_details = []

        for participant in participants:
            quantity = Decimal(participant.quantity)  # Ensure quantity is Decimal
            advance = discounted_price_per_unit * quantity * Decimal("0.05")
            remaining = discounted_price_per_unit * quantity

            # Create a CampaignOrder for each participant
            order = CampaignOrder.objects.create(
                participant=participant.user,
                campaign=campaign,
                quantity=quantity,
                total_price=remaining
            )
            orders.append(order)

            # Track total quantities and amounts
            total_campaign_quantity += quantity
            total_campaign_amount += remaining

            # Collect participant details for the email
            participant_details.append(f"- {participant.user.first_name} ({quantity} Kg) - {remaining:.2f} KD")

            # Create a Notification for the participant
            Notification.objects.create(
                user=participant.user,
                message=f"You have a campaign order to pay the remaining amount of {remaining:.2f}. Please pay it soon.",
            )

        # Send a single summary email to the wholesaler
        self.send_wholesaler_email(campaign, total_campaign_quantity, total_campaign_amount, participant_details)

        # Mark the campaign as inactive or dispersed
        campaign.is_active = False
        campaign.save()
        variant.is_in_campaign = False
        variant.save()
        variant.product.is_in_campaign = False
        variant.product.save()  # Save the product

    def send_wholesaler_email(self, campaign, total_quantity, total_amount, participant_details):
        wholesaler_email = 'harifn786@gmail.com'
        order_no = f"PO-{campaign.id:04d}"
        variant = campaign.variant
        order_date = datetime.now().strftime('%d/%m/%Y')

        # Generate PDF
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawString(200, height - 50, "PURCHASE ORDER")

        # Order Info
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 80, f"Order No: {order_no}")
        p.drawString(400, height - 80, f"Date: {order_date}")

        # Buyer & Seller Info
        buyer_info = "Abdul Rahman Sultan Sons Co.\nBuilding 49/51, Block 2, Kabed, Kuwait\nTel: +965 22095001 | Fax: +965 24710452"
        seller_info = "Indian Research organisation, Street 4, Delhi, India\nTel: +974 44675626 | Email: sales@qipbf-india.com"

        p.drawString(50, height - 120, "BUYER:")
        p.setFont("Helvetica", 10)
        for i, line in enumerate(buyer_info.split('\n')):
            p.drawString(70, height - 140 - (i * 15), line)

        p.setFont("Helvetica", 12)
        p.drawString(50, height - 200, "SELLER:")
        p.setFont("Helvetica", 10)
        for i, line in enumerate(seller_info.split('\n')):
            p.drawString(70, height - 220 - (i * 15), line)

        # Product Table Header
        p.setFont("Helvetica-Bold", 12)
        p.drawString(60, height - 250, "Product Name")
        p.drawString(160, height - 250, "Brand Name")
        p.drawString(260, height - 250, "Variant")
        p.drawString(360, height - 250, "Quantity")
        p.drawString(460, height - 250, "Unit Price (KD)")
        p.drawString(560, height - 250, "Total Amount (KD)")

        p.line(30, height - 255, 580, height - 255)

        # Product Row
        p.setFont("Helvetica", 10)
        p.drawString(60, height - 270, f"{variant.product.product_name}")
        p.drawString(160, height - 270, f"{variant.brand}")
        if variant.weight:
            p.drawString(260, height - 270, f"{variant.weight} Kg")
        elif variant.liter:
            p.drawString(260, height - 270, f"{variant.liter} L")
        p.drawString(360, height - 270, f"{total_quantity} ")
        discounted_price = variant.get_discounted_price()
        p.drawString(460, height - 270, f"{discounted_price:.2f}") 
        p.drawString(560, height - 270, f"{total_amount}")

        # Payment Terms
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 320, "Payment Terms:")
        p.setFont("Helvetica", 10)
        p.drawString(70, height - 340, "5% advance payment collected.")
        p.drawString(70, height - 355, "Balance due upon delivery.")

        # Shipment Details
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 380, "Shipment Details:")
        p.setFont("Helvetica", 10)
        p.drawString(70, height - 400, "Expected Delivery: 3 – 4 weeks after advance payment.")
        p.drawString(70, height - 415, "Shipment Port: Shuwaikh Port, Kuwait")
        p.drawString(70, height - 430, "No. of Containers: 1X40 HC")

        # Signatures
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 460, "Buyer Signature: ______________________")
        p.drawString(300, height - 460, "Seller Signature: ______________________")

        p.showPage()
        p.save()

        # Attach PDF to Email
        buffer.seek(0)
        email = EmailMessage(
            subject=f"PURCHASE ORDER - {order_no} | {campaign.title}",
            body="Please find the attached Purchase Order for your reference.",
            from_email=settings.EMAIL_HOST_USER,
            to=[wholesaler_email],
        )
        email.attach(f"Purchase_Order_{order_no}.pdf", buffer.getvalue(), 'application/pdf')
        email.send()


class StartCampaignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        print("Data received:", data)
        try:
            variant = ProductVariant.objects.get(id=data.get("variant"))
            product = variant.product.is_in_campaign
            print("Product:@@@@@@@@@@@@@@@@@@@@@", product)
            
            
            # if not product.is_available:
            #     return Response({"error": "Product is not available"}, status=status.HTTP_400_BAD_REQUEST)
            if "discounted_price" in data:
                data["discounted_price"] = round(decimal.Decimal(data["discounted_price"]), 2)
            serializer = CampaignListSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                campaign = serializer.save()  # Save the campaign

                # Set the variant and product as being in the campaign
                variant.is_in_campaign = True
                variant.product.is_in_campaign = True

                # Save both in a single step if no other changes are required
                variant.product.save()  # Save the product
                variant.save() 

                self.create_campaign_participant(campaign, request)
                return Response({"message": "Campaign started successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
            
            print("Serializer errors:", serializer.errors)  # 🛑 Debug: Show errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ProductVariant.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    def create_campaign_participant(self, campaign, request):
        print("Creating campaign participant...@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        participant_quantity = request.data.get('quantity', 1)
        participant = CampaignParticipant.objects.filter(campaign=campaign, user=request.user).first()
        if participant:
            participant.quantity = participant_quantity
            participant.save()
        else:
            CampaignParticipant.objects.create(campaign=campaign, user=request.user, quantity=participant_quantity)

        campaign.current_quantity = CampaignParticipant.objects.filter(campaign=campaign).aggregate(
            total_quantity=Sum('quantity')
        )['total_quantity'] or 0

        campaign.save()

        if campaign.current_quantity >= campaign.variant.minimum_order_quantity_for_offer:
            self.disperse_campaign(campaign)

    def disperse_campaign(self, campaign):
        participants = campaign.participants.all()
        orders = []

        variant = campaign.variant
        if variant.campaign_discount_percentage is None or variant.price is None:
            raise ValueError("Product's actual price or discount percentage is not set.")

        price = Decimal(variant.price)
        discount_percentage = Decimal(variant.campaign_discount_percentage)
        discounted_price_per_unit = price * (Decimal(1) - discount_percentage / Decimal(100))

        total_campaign_quantity = Decimal(0)
        total_campaign_amount = Decimal(0)
        participant_details = []

        for participant in participants:
            quantity = Decimal(participant.quantity)
            advance = discounted_price_per_unit * quantity * Decimal("0.05")
            remaining = discounted_price_per_unit * quantity - advance

            order = CampaignOrder.objects.create(
                participant=participant.user,
                campaign=campaign,
                quantity=quantity,
                total_price=remaining
            )
            orders.append(order)

            total_campaign_quantity += quantity
            total_campaign_amount += remaining

            participant_details.append(f"- {participant.user.first_name} ({quantity} Kg) - {remaining:.2f} KD")

        # 📧 Send email to wholesaler
        self.send_wholesaler_email(campaign, total_campaign_quantity, total_campaign_amount, participant_details)

        campaign.is_active = False
        campaign.save()
        variant.is_in_campaign = False
        variant.save()

    def send_wholesaler_email(self, campaign, total_quantity, total_amount, participant_details):
        wholesaler_email = 'harifn786@gmail.com'
        order_no = f"PO-{campaign.id:04d}"
        variant = campaign.variant
        order_date = datetime.now().strftime('%d/%m/%Y')

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawString(200, height - 50, "PURCHASE ORDER")

        p.setFont("Helvetica", 12)
        p.drawString(50, height - 80, f"Order No: {order_no}")
        p.drawString(400, height - 80, f"Date: {order_date}")

        # Buyer & Seller Info
        buyer_info = "Abdul Rahman Sultan Sons Co.\nBuilding 49/51, Block 2, Kabed, Kuwait\nTel: +965 22095001"
        seller_info = "Indian Research Organisation, Delhi, India\nTel: +974 44675626 | Email: sales@qipbf-india.com"

        p.drawString(50, height - 120, "BUYER:")
        p.setFont("Helvetica", 10)
        for i, line in enumerate(buyer_info.split('\n')):
            p.drawString(70, height - 140 - (i * 15), line)

        p.setFont("Helvetica", 12)
        p.drawString(50, height - 200, "SELLER:")
        p.setFont("Helvetica", 10)
        for i, line in enumerate(seller_info.split('\n')):
            p.drawString(70, height - 220 - (i * 15), line)

        # Product Table Header
        p.setFont("Helvetica-Bold", 12)
        p.drawString(60, height - 280, "Product Name")
        p.drawString(60, height - 280, "Brand Name")
        p.drawString(200, height - 280, "Quantity")
        p.drawString(280, height - 280, "Unit Price (KD)")
        p.drawString(380, height - 280, "Total Amount (KD)")

        p.line(30, height - 285, 510, height - 285)

        # Product Row
        p.setFont("Helvetica", 10)
        p.drawString(60, height - 300, f"{variant.product.product_name}")
        p.drawString(60, height - 300, f"{variant.brand}")
        p.drawString(200, height - 300, f"{total_quantity} Kg")
        discounted_price = variant.get_campaign_discounted_price()
        p.drawString(280, height - 300, f"{discounted_price:.2f}")
        p.drawString(380, height - 300, f"{total_amount}")

        # Payment Terms
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 420, "Payment Terms:")
        p.setFont("Helvetica", 10)
        p.drawString(70, height - 440, "5% advance payment collected.")
        p.drawString(70, height - 455, "Balance due upon delivery.")

        # Shipment Details
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 490, "Shipment Details:")
        p.setFont("Helvetica", 10)
        p.drawString(70, height - 510, "Expected Delivery: 3–4 weeks after advance payment.")
        p.drawString(70, height - 525, "Shipment Port: Shuwaikh Port, Kuwait")

        # Signatures
        p.drawString(50, height - 580, "Buyer Signature: ______________________")
        p.drawString(300, height - 580, "Seller Signature: ______________________")

        p.showPage()
        p.save()

        buffer.seek(0)
        email = EmailMessage(
            subject=f"PURCHASE ORDER - {order_no} | {campaign.title}",
            body="Please find the attached Purchase Order for your reference.",
            from_email=settings.EMAIL_HOST_USER,
            to=[wholesaler_email],
        )
        email.attach(f"Purchase_Order_{order_no}.pdf", buffer.getvalue(), 'application/pdf')
        email.send()



class WholesalerCampaignsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Fetch the wholesaler's email from request headers
            email = request.headers.get('Email')
            if not email:
                raise PermissionDenied("Email header is required.")

            wholesaler = User.objects.get(email=email, user_type = "wholesaler")
        except User.DoesNotExist:
            raise PermissionDenied("You are not a wholesaler.")
        
        # Get all campaigns where the wholesaler's product is part of the campaign
        campaigns = Campaign.objects.filter(product__wholesaler=wholesaler)

        # ✅ Pass the `request` context to the serializer
        serializer = CampaignSerializer(campaigns, many=True, context={'request': request})
        
        return Response({
            'campaigns': serializer.data
        })



class UpdateQuantityView(APIView):
    """
    Class-based view to update the quantity for a campaign by a user.
    """

    def post(self, request, campaign_id):
        # Safely get the campaign or return 404
        campaign = get_object_or_404(Campaign, id=campaign_id)

        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract and validate the new quantity
        new_quantity = request.data.get('quantity')
        if not new_quantity or not new_quantity.isdigit() or int(new_quantity) < 1:
            return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)

        new_quantity = int(new_quantity)

        # Check if the new quantity exceeds the stock limit
        if new_quantity > campaign.product.stock:
            return Response({"error": "Quantity exceeds available stock"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve or create a participant record for this user and campaign
        participant, created = CampaignParticipant.objects.get_or_create(
            campaign=campaign,
            user=request.user,
            defaults={"quantity": new_quantity}
        )

        if not created:
            # Update the existing participant's quantity
            participant.quantity = new_quantity
            participant.save()

        # Update the campaign's `current_quantity` field
        campaign.current_quantity = sum(
            p.quantity for p in campaign.participants.all()
        )
        campaign.save()

        # Return a success response
        return Response(
            {
                "message": "Quantity updated successfully",
                "current_quantity": campaign.current_quantity
            },
            status=status.HTTP_200_OK
        )
    

class UserCampaignsView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this endpoint

    def get(self, request, *args, **kwargs):
        # Get the user based on the request's authenticated user
        user = request.user

        # Get all campaigns the user has joined
        campaigns = CampaignParticipant.objects.filter(user=user).select_related('campaign')

        # Serialize the campaigns and pass request context
        campaign_data = CampaignSerializer([cp.campaign for cp in campaigns], many=True, context={'request': request})

        return Response(campaign_data.data)
