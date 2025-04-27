from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from authentication.models import User,ProductCategory
from wholesaler.models import Product, ProductVariant, ProductVariantImage, WholesalerBankDetails

# Inline for displaying variants of the product
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('brand', 'weight', 'liter', 'price', 'stock', 'is_in_campaign')
    readonly_fields = ('brand', 'weight', 'liter', 'price', 'stock', 'is_in_campaign')

# Inline for displaying products related to a wholesaler
class ProductInline(admin.TabularInline):
    model = Product
    extra = 1
    fields = ('product_name', 'category', 'wholesaler')
    readonly_fields = ('product_name', 'category')

# Custom Admin for User model (wholesaler)
class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    list_display = ["id", "email", "first_name", "last_name", "user_type", "is_active", "is_admin", "is_staff"]
    list_filter = ["user_type", "is_active", "is_admin", "is_staff"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["email", "id"]
    filter_horizontal = []

    # For fields that should be displayed in the detail view
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["profile_img","company_name", "first_name", "last_name", "street_address", "phone_number", "city", "zipcode", "country", "license_number", "license_image", "mobile_number1", "mobile_number2", "mobile_number3"]}),
        ("Role", {"fields": ["user_type"]}),  # Display user type here
        ("Permissions", {"fields": ["is_active", "is_admin", "is_staff", "is_superuser"]}),
    ]

    # For creating a new user
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "first_name", "last_name", "user_type", "password1", "password2"],
            },
        ),
    ]

    # Adding ProductInline to the admin page to display related products for the wholesaler
    inlines = [ProductInline]

# Register the custom UserAdmin
admin.site.register(User, UserModelAdmin)
admin.site.register(ProductCategory)