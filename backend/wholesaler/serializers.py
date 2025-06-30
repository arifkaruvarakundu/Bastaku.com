from rest_framework import serializers
from authentication.models import User,ProductCategory
from .models import Product,ProductVariantImage,ProductVariant
from django.conf import settings
from authentication.serializers import ProductCategorySerializer
from .models import WholesalerBankDetails

class WholesalerProfileSerializer(serializers.ModelSerializer):
    license_image = serializers.SerializerMethodField()

    def get_license_image(self, obj):
        if obj.license_image:
            return f"{settings.MEDIA_URL}wholesaler_licenses/{obj.license_image.name}"
        return None
    
    class Meta:
        model = User
        fields = ['license_image', 'street_address', 'zipcode', 'country', 'mobile_number1', 'mobile_number2', 'mobile_number3','company_name', 'email','license_number']

class ProductVariantImageSerializer(serializers.ModelSerializer):
    """Serializer for images related to a product variant."""
    
    class Meta:
        model = ProductVariantImage
        fields = ["id", "image_url", "public_id", "is_default"] 

class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for product variants including related images."""
    
    variant_images = ProductVariantImageSerializer(many=True, read_only=True)  # Fetch all related images

    class Meta:
        model = ProductVariant
        fields = [
            "id", "brand", "weight", "liter", "price", "stock",
            'campaign_discount_admin', 'campaign_discount_wholesaler', "minimum_order_quantity_for_offer_by_wholesaler", 
            "minimum_order_quantity_for_offer_by_admin", "wholesaler", "variant_images", "is_in_campaign", "is_available","is_default"
        ]

class ProductSerializer(serializers.ModelSerializer):
    """Serializer for product details including all variants and their images."""
    
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "product_name", "product_name_en", "product_name_ar", "description", 
            "description_en", "description_ar", "is_in_campaign", "is_available", "category", "is_active",
            "wholesaler", "created_date", "modified_date", "slug", "variants"
        ]

class WholesalerBankDetailsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = WholesalerBankDetails
        fields = '__all__'
        
class AdminProductListSerializer(serializers.ModelSerializer):

    """Serializer for product details including all variants and their images."""
    category_name = serializers.SerializerMethodField()
    wholesaler_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "product_name", "is_in_campaign", "is_available", "category", "wholesaler", "category_name", "wholesaler_name"
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None
    
    def get_wholesaler_name(self,obj):
        return obj.wholesaler.company_name if obj.wholesaler else None

