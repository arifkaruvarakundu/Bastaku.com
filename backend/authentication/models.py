from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.utils import timezone
#  Custom User Manager

class ProductCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category_image = models.ImageField(upload_to='photos/categories', null=True)

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, user_type='customer', **extra_fields):
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        # Create the user with the provided user_type, defaulting to 'customer'
        user = self.model(email=email, user_type=user_type, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, user_type='wholesaler', **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # Always set user_type to 'wholesaler' for superuser
        return self.create_user(email, password, user_type=user_type, **extra_fields)

# Unified User Model
class User(AbstractBaseUser):
    USER_TYPE_CHOICES = (
        ('customer', 'Customer'),
        ('wholesaler', 'Wholesaler'),
    )

    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    first_name = models.CharField(max_length=200, default="Anonymous", null=True, blank=True)
    last_name = models.CharField(max_length=200, null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')

    # Common Fields
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # Profile Image
    profile_img = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # Address Fields (Shared)
    street_address = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=25, null=True, blank=True, verbose_name="Phone Number")
    city = models.CharField(max_length=25, null=True, blank=True)
    zipcode = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    # Wholesaler-Specific Fields
    company_name = models.CharField(max_length=255, unique=True, null=True, blank=True)
    product_category = models.ForeignKey('ProductCategory', on_delete=models.CASCADE, null=True, blank=True)
    license_number = models.CharField(max_length=50, null=True, blank=True)
    license_image = models.ImageField(upload_to='wholesaler_licenses/', blank=True, null=True)
    mobile_number1 = models.CharField(max_length=25, null=True, blank=True, verbose_name="Mobile Number 1")
    mobile_number2 = models.CharField(max_length=25, null=True, blank=True, verbose_name="Mobile Number 2")
    mobile_number3 = models.CharField(max_length=25, null=True, blank=True, verbose_name="Mobile Number 3")

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


