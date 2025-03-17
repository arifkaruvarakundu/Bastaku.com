from django.contrib import admin
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from authentication.models import User
from .models import *
from wholesaler.models import ProductVariant, ProductVariantImage
class UserModelAdmin(BaseUserAdmin):

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["id","email", "name", "tc", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["name","tc"]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name","tc", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email","id"]
    filter_horizontal = []



# Inline for displaying related products
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0  # No extra empty forms
    show_change_link = True  # Allows clicking on the product variant to edit
    fields = ('brand', 'weight', 'liter', 'price', 'stock', 'campaign_discount_percentage', 'minimum_order_quantity_for_offer')  # Fields to display
    readonly_fields = ('brand', 'weight', 'liter', 'price', 'stock', 'campaign_discount_percentage', 'minimum_order_quantity_for_offer')  # Optional if you want read-only
    verbose_name = 'Product Variant'
    verbose_name_plural = 'Product Variants'

class ProductVariantImageInline(admin.TabularInline):
    model = ProductVariantImage
    extra = 1
    fields = ('variant', 'image', 'wholesaler')  # Display variant and wholesaler
    readonly_fields = ('variant', 'wholesaler')  # Optional: Make wholesaler readonly


# Wholesaler Admin
class WholesalerAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'email', 'mobile_number1', 'mobile_number2', 'mobile_number3', 'is_active')  # Display in wholesaler list view
    search_fields = ('company_name', 'email')  # Enable search
    inlines = [ProductVariantInline]  # Add inline products under each wholesaler

# Register the models
admin.site.register(Wholesaler, WholesalerAdmin)

# Now register the new UserAdmin...
admin.site.register(User)
admin.site.register(ProductCategory)
# admin.site.register(Wholesaler)