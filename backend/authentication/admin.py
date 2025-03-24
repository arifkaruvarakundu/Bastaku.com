from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from authentication.models import User

class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["id", "email", "first_name", "last_name", "user_type", "is_active", "is_admin", "is_staff"]
    list_filter = ["user_type", "is_active", "is_admin", "is_staff"]  # Add user_type filter to allow filtering by roles
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["email", "id"]
    filter_horizontal = []

    # For fields that should be displayed in the detail view
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["company_name", "first_name", "last_name", "street_address", "phone_number", "city", "zipcode", "country", "license_number", "license_image", "mobile_number1", "mobile_number2", "mobile_number3"]}),
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

# Register the custom UserAdmin
admin.site.register(User, UserModelAdmin)