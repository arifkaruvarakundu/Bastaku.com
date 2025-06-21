from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Order, CampaignOrder, Payment, Notification
from .serializers import OrderSerializer, CampaignOrderSerializer, NotificationSerializer
from authentication.models import User
from authentication.renderers import UserRenderer
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils.crypto import get_random_string
from rest_framework import status

# Create your views here.

class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def get(self, request):
        
        # Get all orders for the current user
        orders = Order.objects.filter(user=request.user)
        campaign_orders = CampaignOrder.objects.filter(participant=request.user)

        # Serialize the orders and campaign orders
        order_serializer = OrderSerializer(orders, many=True)
        campaign_order_serializer = CampaignOrderSerializer(campaign_orders, many=True)

        return Response({
            'orders': order_serializer.data,
            'campaign_orders': campaign_order_serializer.data,
            
        })
    

class WholesalerOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def get(self, request):
        try:
            # Use the corrected way to fetch the email header
            email = request.headers.get('Email')
            if not email:
                raise PermissionDenied("Email header is required.")

            wholesaler = User.objects.get(email=email, user_type="wholesaler")
            
        except User.DoesNotExist:
            raise PermissionDenied("You are not a wholesaler.")
        
        # Get all orders for the products supplied by this wholesaler
        orders = Order.objects.filter(variant__wholesaler=wholesaler)
        
        # Get all campaign orders for the products supplied by this wholesaler
        
        campaign_orders = CampaignOrder.objects.filter(
            Q(variant__wholesaler=wholesaler) | Q(campaign__variant__wholesaler=wholesaler)).distinct()
        
        # Serialize the orders and campaign orders
        order_serializer = OrderSerializer(orders, many=True)
        campaign_order_serializer = CampaignOrderSerializer(campaign_orders, many=True)
        
        return Response({
            'orders': order_serializer.data,
            'campaign_orders': campaign_order_serializer.data
        })

class AdvancePaymentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Extracting data from the request
        total_amount = request.data.get('total_amount', 0)
        advance_payment = total_amount * 0.05
        payment_method = request.data.get('payment_method', 'card')  # Default to card
        payment_type = 'advance'
        status_str = 'advance_paid'  # Set the status to "advance_paid"
        
        # Generate a random payment_id for now
        payment_id = get_random_string(length=32)

        # Create the payment object
        payment = Payment.objects.create(
            user=request.user,
            payment_id=payment_id,
            payment_method=payment_method,
            amount_paid=advance_payment,
            status=status_str,
            payment_type=payment_type
        )

        return Response({
            'payment_id': payment.payment_id,
            'amount_paid': payment.amount_paid,
            'status': payment.status,
        }, status=status.HTTP_201_CREATED)

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all notifications for the authenticated user
        notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Mark a specific notification as read
        notification = Notification.objects.get(id=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({"status": "success"})

