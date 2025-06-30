from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Order, CampaignOrder, Payment, Notification
from .serializers import OrderSerializer, CampaignOrderSerializer, NotificationSerializer, AdminRegularOrdersListsSerializer, AdminCampaignOrdersSerializer, RegularOrderDetailSerializer, CampaignOrderDetailSerializer
from authentication.models import User
from authentication.renderers import UserRenderer
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils.crypto import get_random_string
from rest_framework import status
from django.shortcuts import get_object_or_404

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
    
class AdminRegularOrdersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get all regular orders
        orders = Order.objects.all()
        order_serializer = AdminRegularOrdersListsSerializer(orders, many=True)
        
        return Response({
            'orders': order_serializer.data
        })
    
class AdminCampaignOrdersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get all campaign orders
        campaign_orders = CampaignOrder.objects.all()
        campaign_order_serializer = AdminCampaignOrdersSerializer(campaign_orders, many=True)

        return Response({
            'orders': campaign_order_serializer.data
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

class AdminRegularOrderDetailsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)

        serializer = RegularOrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminEditRegularOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        serializer = RegularOrderDetailSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminDeleteRegularOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, order_id, *args, **kwargs):
        try:
            order = Order.objects.get(pk=order_id)
            order.delete()
            return Response({"detail":"Order deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        
class AdminCampaignOrderDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(CampaignOrder, id=order_id)

        serializer = CampaignOrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AdminEditCampaignOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        order = get_object_or_404(CampaignOrder, id=order_id)
        serializer = CampaignOrderDetailSerializer(order, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminDeleteCampaignOrderView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, order_id, *args, **kwargs):
        try:
            order = CampaignOrder.objects.get(pk=order_id)
            order.delete()
            return Response({"detail":"Order deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CampaignOrder.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)