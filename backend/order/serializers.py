from rest_framework import serializers
from .models import Order, CampaignOrder,Notification, OrderItem
from authentication.serializers import UserSerializer
from wholesaler.serializers import ProductVariantSerializer
from wholesaler.models import ProductVariant

class ProductVariantFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['weight', 'liter']  # Only include weight

class OrderSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product_wholesaler = serializers.CharField(source='variant.product.wholesaler.company_name', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantFieldsSerializer(read_only=True)
    price = serializers.DecimalField(source='product_variant.price', max_digits=10, decimal_places=3, read_only=True)
    product = serializers.CharField(source='product_variant.product.product_name', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['product','product_variant','price', 'quantity', 'total_price']


class CampaignOrderSerializer(serializers.ModelSerializer):
    campaign = serializers.StringRelatedField()
    variant = ProductVariantSerializer(source='campaign.variant', read_only=True)
    # product_name = serializers.CharField(source='campaign.product.product_name', read_only=True)
    # product_image = serializers.ImageField(source='campaign.product.product_image', read_only=True)
    campaign_product_wholesaler = serializers.CharField(source='campaign.variant.product.wholesaler.company_name')
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    participant = UserSerializer()  # Include user details in the campaign order

    class Meta:
        model = CampaignOrder
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class MinimalVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['brand', 'weight', 'liter', 'minimum_order_quantity_for_offer_by_admin']

class AdminRegularOrdersListsSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user_name', 'status', 'total_price', 'created_at'
        ]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user else "Unknown User"
    
    def get_total_price(self, obj):  # <-- Implement this method
        return obj.total_amount()
    
class AdminCampaignOrdersSerializer(serializers.ModelSerializer):
    campaign = serializers.StringRelatedField()
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    campaign_id = serializers.IntegerField(source='campaign.id', read_only=True)
    participant = serializers.SerializerMethodField() 

    class Meta:
        model = CampaignOrder
        fields = [
            'id', 'participant', 'campaign', 'campaign_title', 'total_amount', 'created_at', 'payment_status', 'status', 'campaign_id'
        ]

    def get_participant(self, obj):
        return f"{obj.participant.first_name} {obj.participant.last_name}" if obj.participant else "Unknown Participant"
    
class RegularOrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ['id', 'status', 'created_at', 'updated_at', 'total_amount', 'items']

class CampaignOrderItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantFieldsSerializer(read_only=True)
    price = serializers.DecimalField(source='product_variant.price', max_digits=10, decimal_places=3, read_only=True)
    product = serializers.CharField(source='product_variant.product.product_name', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem  # Adjust if you have a separate model for campaign order items
        fields = ['product', 'product_variant', 'price', 'quantity', 'total_price']

class CampaignOrderDetailSerializer(serializers.ModelSerializer):
    items = CampaignOrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = CampaignOrder
        fields = ['id', 'status', 'created_at', 'updated_at', 'total_amount', 'items', 'payment_status']