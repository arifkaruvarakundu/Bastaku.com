from django.db import models
from authentication.models import User
from wholesaler.models import Product
from django.utils.timezone import now
from django.utils.timezone import now

class Campaign(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="campaigns")
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    current_quantity = models.PositiveIntegerField(default=0)  # New field added
    is_active = models.BooleanField(default=True)
    # payment_option = models.CharField(max_length=20,choices=[
    #         ('free', 'Free'),
    #         ('10_percent', '10% Advance'),
    #         ('100_percent', 'Full Payment')
    #     ],
    #     default='free'
    # )
    # discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    # advance_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.title

    def has_ended(self):
        # Safeguard against None for end_time
        if self.end_time is None:
            return False  # If no end_time, assume campaign hasn't ended
        return now() > self.end_time

    @property
    def current_participants(self):
        # This will dynamically count the number of participants
        return self.participants.count()

class CampaignParticipant(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.campaign.title}"