from django.contrib import admin
from .models import Product, ProductImage, WholesalerBankDetails

# Inline for ProductImages
class ProductImageInline(admin.TabularInline):
    model = ProductImage
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

# Registering other models
admin.site.register(WholesalerBankDetails)

