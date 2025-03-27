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

    def get_images(self, obj):
        # Access the first image's URL using the image_url attribute
        return obj.product_images.first().image_url if obj.product_images.exists() else "No Image"
    get_images.short_description = "Product Image"

class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'brand', 'weight', 'liter', 'price', 'stock', 'campaign_discount_percentage', 'minimum_order_quantity_for_offer', 'wholesaler' )  # Add fields you want to see
    # search_fields = ('id', 'name')  # Allow search by ID and name
    # list_filter = ('price',)  # Optional: Add filter

# Registering other models
admin.site.register(WholesalerBankDetails)
admin.site.register(ProductVariant, ProductVariantAdmin)
admin.site.register(ProductVariantImage)