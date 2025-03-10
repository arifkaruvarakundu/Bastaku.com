from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.utils import timezone
#  Custom User Manager

class UserManager(BaseUserManager):
  def create_user(self, email, first_name,last_name, password=None, password2=None):
      """
      Creates and saves a User with the given email, name, tc and password.
      """
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          first_name=first_name,
          last_name=last_name
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, first_name, password=None):
      """
      Creates and saves a superuser with the given email, name, tc and password.
      """
      user = self.create_user(
          email,
          password=password,
          first_name=first_name,
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    first_name = models.CharField(max_length=200, default="Anonymous")
    last_name = models.CharField(max_length=200, null=True, blank=True)
    tc = models.BooleanField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Profile Image
    profile_img = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    # Address Fields
    street_address = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=25, null=True, blank=True,verbose_name="Phone Number")
    city = models.CharField(max_length=25,null=True, blank=True)
    zipcode = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin


class ProductCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category_image = models.ImageField(upload_to='photos/categories', null=True)

    def __str__(self):
        return self.name

from django.contrib.auth.models import BaseUserManager

class WholesalerManager(BaseUserManager):
    def create_user(self, company_name, email, license_number, password=None, **extra_fields):
        if not company_name:
            raise ValueError("The Company Name is required")
        if not email:
            raise ValueError("The Email is required")

        email = self.normalize_email(email)
        user = self.model(
            company_name=company_name,
            email=email,
            license_number=license_number,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, company_name, email, license_number, password=None, **extra_fields):
        user = self.create_user(
            company_name,
            email,
            # product_category,
            license_number,
            password=password,**extra_fields
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class Wholesaler(AbstractBaseUser):
    company_name = models.CharField(max_length=255, unique=True)
    product_category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE,null=True, blank=True)
    email = models.EmailField(verbose_name='Email', max_length=255, unique=True, null=True, blank=True)
    license_number = models.CharField(max_length=50)
    license_image = models.ImageField(upload_to='wholesaler_licenses/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # Address Fields
    street_address = models.CharField(max_length=255, null=True, blank=True)

    mobile_number1= models.CharField(
        max_length=25,
        null=True, 
        blank=True,
        verbose_name="Mobile Number1"
    )

    mobile_number2= models.CharField(
        max_length=25,
        null=True, 
        blank=True,
        verbose_name="Mobile Number2"
    )

    mobile_number3= models.CharField(
        max_length=25,
        null=True, 
        blank=True,
        verbose_name="Mobile Number3"
    )

    zipcode = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    objects = WholesalerManager()

    is_wholesaler = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS =  ['email', 'product_category', 'license_number', 'company_name','mobile_number1']

    def __str__(self):
        return self.company_name

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

    class Meta:
        verbose_name = 'Wholesaler'
        verbose_name_plural = 'Wholesalers'

