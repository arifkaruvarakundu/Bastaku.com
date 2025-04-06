from django.contrib import admin
from .models import Product, ProductVariantImage, WholesalerBankDetails, ProductVariant

# Inline for ProductImages
class ProductImageInline(admin.TabularInline):
    model = ProductVariantImage
    extra = 1

# Admin class for Product
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ("product_name", "get_images")
    search_fields = ('product_name',)  # Enable search by product name

    def get_images(self, obj):
        # Access the first image's URL using the image_url attribute
        return obj.product_images.first().image_url if obj.product_images.exists() else "No Image"
    get_images.short_description = "Product Image"

    def get_queryset(self, request):
        """
        This method filters the products based on the logged-in wholesaler.
        It will display only products related to the logged-in user (wholesaler).
        """
        queryset = super().get_queryset(request)
        # If the user is a wholesaler, filter the products by the logged-in user
        if request.user.user_type == 'wholesaler':
            queryset = queryset.filter(wholesaler=request.user)
        return queryset

class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'brand', 'weight', 'liter', 'price', 'is_in_campaign', 'stock', 'campaign_discount_percentage', 'minimum_order_quantity_for_offer', 'wholesaler' )  # Add fields you want to see
    search_fields = ('id', 'product__product_name')  # Allow search by ID and name
    # list_filter = ('price',)  # Optional: Add filter

# Registering other models
admin.site.register(WholesalerBankDetails)
admin.site.register(ProductVariant, ProductVariantAdmin)
admin.site.register(ProductVariantImage)