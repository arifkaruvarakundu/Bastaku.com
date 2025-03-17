from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from cloudinary.models import CloudinaryField
from authentication.models import ProductCategory, Wholesaler
# Create your models here.

# class Product(models.Model):
#     product_name = models.CharField(max_length=200)
#     slug = models.SlugField(max_length=200, unique=True, null=True, blank=True)
#     description = models.TextField(max_length=500, blank=True)
#     actual_price = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
#     stock = models.IntegerField(null=True, blank=True)
#     is_in_campaign = models.BooleanField(default=False)
#     is_available = models.BooleanField(default=True)
#     category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, null=True, blank=True)
#     campaign_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, help_text="Enter discount as a percentage (e.g., 20 for 20%)")
#     minimum_order_quantity_for_offer = models.PositiveIntegerField(default=1)
#     created_date = models.DateTimeField(auto_now_add=True)
#     modified_date = models.DateTimeField(auto_now=True)
#     wholesaler = models.ForeignKey(Wholesaler, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')

#     # weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Enter the weight of the product in kilograms (e.g., 5.0 for 5kg)")
#     unit = models.TextField(max_length=100, null=True, blank=True)


#     def get_url(self):
#         return reverse('product_detail', args=[self.category.name, self.slug])

#     def get_campaign_discounted_price(self):
#         """
#         Calculate and return the discounted price.
#         """
#         if self.campaign_discount_percentage > 0:
#             discount_amount = (self.actual_price * self.campaign_discount_percentage) / 100
#             return self.actual_price - discount_amount
#         return self.actual_price

#     def __str__(self):
#         return self.product_name

class Product(models.Model):
    product_name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, null=True, blank=True)
    description = models.TextField(max_length=500, blank=True)
    # actual_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # Increased max_digits
    # stock = models.IntegerField(null=True, blank=True)
    is_in_campaign = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, null=True, blank=True)
    # campaign_discount_percentage = models.DecimalField(
    #     max_digits=5, decimal_places=2, default=0.0, help_text="Enter discount as a percentage (e.g., 20 for 20%)"
    # )
    # minimum_order_quantity_for_offer = models.PositiveIntegerField(default=1)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')

    def get_url(self):
        return reverse('product_detail', args=[self.category.name, self.slug])

    # def get_campaign_discounted_price(self):
    #     """Calculate and return the discounted price."""
    #     if self.actual_price > 0 and self.campaign_discount_percentage > 0:
    #         discount_amount = (self.actual_price * self.campaign_discount_percentage) / 100
    #         return self.actual_price - discount_amount
    #     return self.actual_price

    def __str__(self):
        return self.product_name


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)

    # Variant fields (can be None)
    brand = models.CharField(max_length=100, null=True, blank=True, help_text="Enter brand name")
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Weight in kg")
    liter = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Volume in liters")

    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(null=True, blank=True)
    campaign_discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.0, help_text="Enter discount as a percentage (e.g., 20 for 20%)"
    )
    minimum_order_quantity_for_offer = models.PositiveIntegerField(default=1)

    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.SET_NULL, null=True, blank=True)  # Associate Wholesaler with ProductVariant


    def get_discounted_price(self):
        """Calculate and return the discounted price for the variant."""
        if self.price > 0 and self.campaign_discount_percentage > 0:
            discount_amount = (self.price * self.campaign_discount_percentage) / 100
            return self.price - discount_amount
        return self.price

    def __str__(self):
        variant_details = []
        if self.brand:
            variant_details.append(f"Brand: {self.brand}")
        if self.weight:
            variant_details.append(f"Weight: {self.weight}kg")
        if self.liter:
            variant_details.append(f"Volume: {self.liter}L")

        return f"{self.product.product_name} - {' | '.join(variant_details)}"

class ProductVariantImage(models.Model):
    variant = models.ForeignKey(ProductVariant, related_name="variant_images", on_delete=models.CASCADE)
    image_url = models.URLField(default="")   # Store the image in Cloudinary
    public_id = models.CharField(max_length=255, default="")  # Store the public_id for Cloudinary images
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.SET_NULL, null=True, blank=True)  # Associate Wholesaler with ProductVariantImage
    product = models.ForeignKey(Product, related_name="product_images", on_delete=models.CASCADE)

    def __str__(self):
        return f"Image for {self.variant.product.product_name} - Variant: {self.variant}"


from django.utils import timezone

class WholesalerBankDetails(models.Model):
    wholesaler = models.OneToOneField(Wholesaler, on_delete=models.CASCADE, related_name='bank_details')
    beneficiary_name = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    bank_address = models.TextField()
    account_number_iban = models.CharField(max_length=50, verbose_name="Account No/IBAN")
    swift_code = models.CharField(max_length=20)

    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"Bank Details for {self.wholesaler.company_name}"

    class Meta:
        verbose_name = "Wholesaler Bank Detail"
        verbose_name_plural = "Wholesaler Bank Details"


