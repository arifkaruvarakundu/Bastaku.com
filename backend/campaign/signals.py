from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Campaign


@receiver(post_save, sender=Campaign)
def update_product_campaign_status(sender, instance, **kwargs):
    """
    Set the is_in_campaign field to True for the product associated with the campaign.
    """
    if instance.product:  # Ensure the campaign has a valid product
        instance.product.is_in_campaign = True
        instance.product.save()

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Campaign

@receiver(post_save, sender=Campaign)
def update_product_campaign_status(sender, instance, **kwargs):
    """
    Set is_in_campaign to True when a product is added to a campaign.
    """
    if instance.product:
        instance.product.is_in_campaign = True
        instance.product.save()

@receiver(post_delete, sender=Campaign)
def remove_product_campaign_status(sender, instance, **kwargs):
    """
    Set is_in_campaign to False if no active campaigns exist for a product.
    """
    if instance.product:
        # Check if the product is part of any other active campaigns
        from datetime import date
        active_campaigns = Campaign.objects.filter(product=instance.product, end_time__gte=date.today())
        if not active_campaigns.exists():
            instance.product.is_in_campaign = False
            instance.product.save()
