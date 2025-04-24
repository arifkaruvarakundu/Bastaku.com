from rest_framework import serializers
from .models import Order, CampaignOrder,Notification
from authentication.serializers import UserSerializer
from wholesaler.serializers import ProductVariantSerializer

class OrderSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    product_wholesaler = serializers.CharField(source='variant.product.wholesaler.company_name', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

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