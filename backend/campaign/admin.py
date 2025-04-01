from django.contrib import admin
from .models import Campaign, CampaignParticipant
from django.utils.html import format_html

# Custom Admin for Campaign
class CampaignAdmin(admin.ModelAdmin):
    # Display fields in the list view of Campaigns
    list_display = ('title','id', 'variant', 'start_time', 'end_time', 'current_quantity', 'current_participants', 'is_active')

    # Add the current_participants as a dynamic property for the list view
    def current_participants(self, obj):
        return obj.current_participants
    current_participants.admin_order_field = 'current_participants'  # Enable sorting by participants
    current_participants.short_description = 'Number of Participants'  # Custom column name

    # Optionally, add more fields to the form view
    fieldsets = (
        (None, {
            'fields': ('title', 'variant', 'discounted_price', 'start_time', 'end_time', 'current_quantity', 'is_active')
        }),
    )

# Register the models with the custom admin class
admin.site.register(Campaign, CampaignAdmin)
admin.site.register(CampaignParticipant)
