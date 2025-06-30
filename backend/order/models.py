from django.db import models
from authentication.models import User
from wholesaler.models import ProductVariant
from campaign.models import Campaign
from django.utils import timezone
# # Create your models here.

# class Payment(models.Model):
#     PAYMENT_TYPES = (
#         ('advance', 'Advance Payment'),
#         ('remaining', 'Remaining Payment'),
#         ('direct', 'Direct Payment'),
#     )

#     PAYMENT_STATUS = (
#         ('advance_paid', 'Advance Paid'),
#         ('full_paid', 'Full Amount Paid'),
#         ('pending', 'Pending'),
#         ('failed', 'Failed'),
#     )

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     payment_id = models.CharField(max_length=100)
#     payment_method = models.CharField(max_length=100)
#     amount_paid = models.DecimalField(max_digits=10, decimal_places=2)  # Amount paid, as a Decimal
#     status = models.CharField(max_length=50, choices=PAYMENT_STATUS, default='pending')  # Payment status
#     payment_type = models.CharField(max_length=50, choices=PAYMENT_TYPES)  # Type of payment (advance, remaining, or direct)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.payment_id
    
# class Order(models.Model):
#     STATUS = (
#         ('New', 'New'),
#         ('Accepted', 'Accepted'),
#         ('Completed', 'Completed'),
#         ('Cancelled', 'Cancelled'),
#     )

#     user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
#     payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, blank=True, null=True)
#     order_number = models.CharField(max_length=20)
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     phone = models.CharField(max_length=15)
#     email = models.EmailField(max_length=50)
#     address_line_1 = models.CharField(max_length=50)
#     address_line_2 = models.CharField(max_length=50, blank=True)
#     country = models.CharField(max_length=50)
#     state = models.CharField(max_length=50)
#     city = models.CharField(max_length=50)
#     order_note = models.CharField(max_length=100, blank=True)
#     order_total = models.FloatField()
#     tax = models.FloatField()
#     status = models.CharField(max_length=10, choices=STATUS, default='New')
#     ip = models.CharField(blank=True, max_length=20)
#     is_ordered = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)


#     def full_name(self):
#         return f'{self.first_name} {self.last_name}'

#     def full_address(self):
#         return f'{self.address_line_1} {self.address_line_2}'

#     def __str__(self):
#         return self.first_name

# class OrderProduct(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, blank=True, null=True)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.IntegerField()
#     product_price = models.FloatField()
#     ordered = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.product.product_name

class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        CONFIRMED = 'Order Confirmed', 'Order Confirmed'
        OUT_FOR_DELIVERY = 'Out for Delivery', 'Out for Delivery'
        CANCELLED = 'Cancelled', 'Cancelled'
        DELIVERED = 'Delivered', 'Delivered'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def total_amount(self):
        return sum(item.total_price() for item in self.items.all())

    def __str__(self):
        return f"Order #{self.id} - {self.user.first_name} {self.user.last_name}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        if self.product_variant.price is None:
            return 0
        return self.product_variant.price * self.quantity


    def __str__(self):
        return f"{self.product_variant.product.product_name} x {self.quantity}"

class CampaignOrder(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        CONFIRMED = 'Order Confirmed', 'Order Confirmed'
        OUT_FOR_DELIVERY = 'Out for Delivery', 'Out for Delivery'
        CANCELLED = 'Cancelled', 'Cancelled'
        DELIVERED = 'Delivered', 'Delivered'

    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="campaign_orders")
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    campaign = models.ForeignKey(Campaign, on_delete=models.PROTECT, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    remaining_balance =models.DecimalField(max_digits=10, decimal_places=3, default=0)
    # Add a field for payment status
    payment_status = models.CharField(
        max_length=50, choices=[('pending', 'Pending'), ('advance_paid', 'Advance Paid'), ('full_paid', 'Full Paid')],
        default='pending'
    )

    def __str__(self):
        return f"CampaignOrder {self.id} - {self.participant.first_name} {self.participant.last_name}"

    def update_payment_status(self):
        """
        Method to update campaign order's payment status based on associated payments.
        """
        if self.payments.filter(status='full_paid').exists():
            self.payment_status = 'full_paid'
        elif self.payments.filter(status='advance_paid').exists():
            self.payment_status = 'advance_paid'
        else:
            self.payment_status = 'pending'
        self.save()

    def total_amount(self):
        return sum(item.total_price() for item in self.items.all())

class CampaignOrderItem(models.Model):
    order = models.ForeignKey(CampaignOrder, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        if self.product_variant.price is None:
            return 0
        return self.product_variant.price * self.quantity

    def __str__(self):
        return f"{self.product_variant.product.product_name} x {self.quantity}"

class Payment(models.Model):
    PAYMENT_TYPES = (
        ('advance', 'Advance Payment'),
        ('remaining', 'Remaining Payment'),
        ('direct', 'Direct Payment'),
    )

    PAYMENT_STATUS = (
        ('advance_paid', 'Advance Paid'),
        ('full_paid', 'Full Amount Paid'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    payment_id = models.CharField(max_length=100, unique=True)  # Ensuring payment IDs are unique
    payment_method = models.CharField(max_length=100)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=PAYMENT_STATUS, default='pending')  # Payment status
    payment_type = models.CharField(max_length=50, choices=PAYMENT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    # Relationships with orders
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, blank=True, related_name="payments"
    )

    campaign_order = models.ForeignKey(
        CampaignOrder, on_delete=models.CASCADE, null=True, blank=True, related_name="payments"
    )

    # Add campaign to directly link to the campaign this payment is for
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, null=True, blank=True, related_name="payments"
    )

    def __str__(self):
        return f"Payment {self.payment_id} - {self.user.first_name} {self.user.last_name}"

    def save(self, *args, **kwargs):
        """
        Override save method to update order and campaign order status
        when payment status changes.
        """
        super().save(*args, **kwargs)

        if self.order:
            self.order.update_payment_status()  # Update the order's payment status

        if self.campaign_order:
            self.campaign_order.update_payment_status()  # Update the campaign order's payment status

class Notification(models.Model):
    user = models.ForeignKey(User, related_name="notifications", on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.first_name} {self.user.last_name} - {self.message}"

class Invoice(models.Model):
    order = models.OneToOneField(Order, related_name="invoice", on_delete=models.CASCADE, null=True, blank=True)
    campaign_order = models.OneToOneField(CampaignOrder, related_name ="invoice", on_delete=models.CASCADE, null=True, blank=True)
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Invoice for Order #{self.order.id}"