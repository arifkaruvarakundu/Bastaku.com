from rest_framework import serializers
from authentication.models import User,ProductCategory
from .models import Product,ProductVariantImage,ProductVariant
from django.conf import settings
from authentication.serializers import ProductCategorySerializer

class WholesalerProfileSerializer(serializers.ModelSerializer):
    license_image = serializers.SerializerMethodField()

    def get_license_image(self, obj):
        if obj.license_image:
            return f"{settings.MEDIA_URL}wholesaler_licenses/{obj.license_image.name}"
        return None
    
    class Meta:
        model = User
        fields = ['license_image', 'street_address', 'zipcode', 'country', 'mobile_number1', 'mobile_number2', 'mobile_number3','company_name', 'email','license_number']

# class ProductImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductImage
#         fields = ['image_url', 'public_id']

# class ProductSerializer(serializers.ModelSerializer):
#     wholesaler = serializers.PrimaryKeyRelatedField(queryset=Wholesaler.objects.all())
#     # discounted_price = serializers.ReadOnlyField(source='get_campaign_discounted_price')
#     discounted_price = serializers.SerializerMethodField()
#     category = serializers.SerializerMethodField()  # Custom field for dynamic representation
#     product_images = ProductImageSerializer(many=True, read_only=True)  # Add this line

#     class Meta:
#         model = Product
#         fields = [
#             'id', 'wholesaler', 'category', 'product_name', 'product_name_en', 'product_name_ar', 'slug', 'description',
#             'description_en', 'description_ar', 'actual_price', 'stock', 'is_in_campaign', 'is_available','discounted_price','unit',
#             'campaign_discount_percentage', 'minimum_order_quantity_for_offer',
#             'created_date', 'modified_date', 'product_images'  # Include 'images'
#         ]

#     def get_category(self, obj):
#         """
#         Custom method to return the category's names in both English and Arabic based on request method.
#         """
#         # Check if category exists
#         if obj.category:
#             request = self.context.get('request')
            
#             if request and request.method == 'GET':
#                 # If GET request, return category names in both languages
#                 return {
#                     'name_en': obj.category.name_en,
#                     'name_ar': obj.category.name_ar
#                 }
#             # If not a GET request, return just the ID
#             return obj.category.id
#         return None
    
#     def get_discounted_price(self, obj):
#         """Ensure discounted_price is safely converted to float"""
#         if obj.get_campaign_discounted_price():
#             return float(obj.get_campaign_discounted_price())
#         return None

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


# class ProductCreateSerializer(serializers.ModelSerializer):
#     wholesaler = serializers.PrimaryKeyRelatedField(queryset=Wholesaler.objects.all())
#     discounted_price = serializers.ReadOnlyField(source='get_discounted_price')
#     category = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all())
#     product_images = serializers.ListField(
#         child=serializers.ImageField(), required=False
#     )

#     class Meta:
#         model = Product
#         fields = [
#             'product_name', 'product_name_en', 'product_name_ar', 'description', 'description_en', 'description_ar', 'actual_price', 'stock', 'category',
#             'campaign_discount_percentage', 'minimum_order_quantity_for_offer', 
#             'wholesaler', 'is_available', 'product_images', 'discounted_price'
#         ]

#     def create(self, validated_data):
#         product_images_data = validated_data.pop('product_images', [])
#         # Create the product
#         product = Product.objects.create(**validated_data)
        
#         # Now save the images correctly
#         for image in product_images_data:
#             ProductImage.objects.create(product=product, image=image)
        
#         return product

# class ProductImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductVariantImage
#         fields = '__all__'

# class ProductVariantSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductVariant
#         fields = '__all__'


# class ProductSerializer(serializers.ModelSerializer):
#     category = ProductCategorySerializer()
#     wholesaler = WholesalerProfileSerializer()
#     variants = ProductVariantSerializer(many=True, read_only=True)
#     product_images = ProductImageSerializer(many=True, read_only=True)

#     class Meta:
#         model = Product
#         fields = '__all__'

# from rest_framework import serializers
# from .models import Product, ProductVariant

# from rest_framework import serializers
# from .models import ProductVariant

# class ProductVariantSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductVariant
#         fields = ['id', 'product', 'brand', 'weight', 'liter', 'price', 'stock', 'campaign_discount_percentage']

# class ProductSerializer(serializers.ModelSerializer):
#     first_variant = serializers.SerializerMethodField()

#     class Meta:
#         model = Product
#         fields = [
#             "product_name", "product_name_en", "product_name_ar", "description_en", "description_ar", "is_in_campaign", "is_available", "category", "wholesaler",
#             "created_date", "modified_date", "slug", "first_variant"
#         ]

#     def get_first_variant(self, obj):
#         # Get the first variant of the product, if exists
#         first_variant = obj.variants.first()
#         if first_variant:
#             return ProductVariantSerializer(first_variant).data
#         return None

class ProductVariantImageSerializer(serializers.ModelSerializer):
    """Serializer for images related to a product variant."""
    
    class Meta:
        model = ProductVariantImage
        fields = ["id", "image_url", "public_id"] 

class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for product variants including related images."""
    
    variant_images = ProductVariantImageSerializer(many=True, read_only=True)  # Fetch all related images

    class Meta:
        model = ProductVariant
        fields = [
            "id", "brand", "weight", "liter", "price", "stock",
            "campaign_discount_percentage", "minimum_order_quantity_for_offer", 
            "wholesaler", "variant_images", "is_in_campaign", "is_available"
        ]

class ProductSerializer(serializers.ModelSerializer):
    """Serializer for product details including all variants and their images."""
    
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "product_name", "product_name_en", "product_name_ar", "description", 
            "description_en", "description_ar", "is_in_campaign", "is_available", "category", 
            "wholesaler", "created_date", "modified_date", "slug", "variants"
        ]
    
from .models import WholesalerBankDetails
class WholesalerBankDetailsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = WholesalerBankDetails
        fields = '__all__'
        
    
