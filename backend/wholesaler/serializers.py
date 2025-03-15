from rest_framework import serializers
from authentication.models import Wholesaler,ProductCategory
from .models import Product,ProductImage
from django.conf import settings


class WholesalerProfileSerializer(serializers.ModelSerializer):
    license_image = serializers.SerializerMethodField()

    def get_license_image(self, obj):
        if obj.license_image:
            return f"{settings.MEDIA_URL}wholesaler_licenses/{obj.license_image.name}"
        return None
    
    class Meta:
        model = Wholesaler
        fields = ['license_image', 'street_address', 'zipcode', 'country', 'mobile_number1', 'mobile_number2', 'mobile_number3','company_name', 'email','license_number']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image_url', 'public_id']

class ProductSerializer(serializers.ModelSerializer):
    wholesaler = serializers.PrimaryKeyRelatedField(queryset=Wholesaler.objects.all())
    # discounted_price = serializers.ReadOnlyField(source='get_campaign_discounted_price')
    discounted_price = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()  # Custom field for dynamic representation
    product_images = ProductImageSerializer(many=True, read_only=True)  # Add this line

    class Meta:
        model = Product
        fields = [
            'id', 'wholesaler', 'category', 'product_name', 'product_name_en', 'product_name_ar', 'slug', 'description',
            'description_en', 'description_ar', 'actual_price', 'stock', 'is_in_campaign', 'is_available','discounted_price','unit',
            'campaign_discount_percentage', 'minimum_order_quantity_for_offer',
            'created_date', 'modified_date', 'product_images'  # Include 'images'
        ]

    def get_category(self, obj):
        """
        Custom method to return the category's names in both English and Arabic based on request method.
        """
        # Check if category exists
        if obj.category:
            request = self.context.get('request')
            
            if request and request.method == 'GET':
                # If GET request, return category names in both languages
                return {
                    'name_en': obj.category.name_en,
                    'name_ar': obj.category.name_ar
                }
            # If not a GET request, return just the ID
            return obj.category.id
        return None
    
    def get_discounted_price(self, obj):
        """Ensure discounted_price is safely converted to float"""
        if obj.get_campaign_discounted_price():
            return float(obj.get_campaign_discounted_price())
        return None

    # def get_category(self, obj):
    #     # Check if it's a GET request (via context)
    #     if not obj.category:
    #         return None 
    #     request = self.context.get('request')
    #     if request and request.method == 'GET':
    #         # Return the category name
    #         return obj.category.name
    #     # Return the ID for other methods (e.g., POST)
    #     return obj.category.id


class ProductCreateSerializer(serializers.ModelSerializer):
    wholesaler = serializers.PrimaryKeyRelatedField(queryset=Wholesaler.objects.all())
    discounted_price = serializers.ReadOnlyField(source='get_discounted_price')
    category = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all())
    product_images = serializers.ListField(
        child=serializers.ImageField(), required=False
    )

    class Meta:
        model = Product
        fields = [
            'product_name', 'product_name_en', 'product_name_ar', 'description', 'description_en', 'description_ar', 'actual_price', 'stock', 'category',
            'campaign_discount_percentage', 'minimum_order_quantity_for_offer', 
            'wholesaler', 'is_available', 'product_images', 'discounted_price'
        ]

    def create(self, validated_data):
        product_images_data = validated_data.pop('product_images', [])
        # Create the product
        product = Product.objects.create(**validated_data)
        
        # Now save the images correctly
        for image in product_images_data:
            ProductImage.objects.create(product=product, image=image)
        
        return product

    
from .models import WholesalerBankDetails
class WholesalerBankDetailsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = WholesalerBankDetails
        fields = '__all__'
        
    
