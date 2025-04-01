from rest_framework import serializers
from .models import Campaign, CampaignParticipant
from wholesaler.serializers import ProductVariantSerializer
from wholesaler.models import Product, ProductVariant

class CampaignSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer()
    has_ended = serializers.SerializerMethodField()
    product_name = serializers.ReadOnlyField(source='product.product_name')
    wholesaler_name = serializers.ReadOnlyField(source='product.wholesaler.company_name')
    participant_quantity = serializers.SerializerMethodField()
    current_participants = serializers.SerializerMethodField()
    product_id = serializers.ReadOnlyField(source='variant.product.id')
    
    def get_participant_quantity(self, obj):
        # Safeguard against unauthenticated users
        user = self.context['request'].user
        if user.is_authenticated:
            participant = CampaignParticipant.objects.filter(campaign=obj, user=user).first()
            return participant.quantity if participant else None
        return None  # Return None for unauthenticated users

    def get_has_ended(self, obj):
        return obj.has_ended()
    def get_current_participants(self, obj):
        """Returns the number of participants in the campaign."""
        return obj.participants.count()
    
    class Meta:
        model = Campaign
        fields = ['id', 'variant', 'title', 'discounted_price', 'start_time', 'end_time', 'current_quantity', 'is_active', 'participant_quantity', 'has_ended', 'product_name', 'wholesaler_name', 'current_participants', 'product_id']
        

class CampaignListSerializer(serializers.ModelSerializer):
    variant = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all())  # Only the ID is returned
    participant_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = '__all__'

    def get_current_participants(self, obj):
        """Returns the number of participants in the campaign."""
        return obj.participants.count()

    def get_participant_quantity(self, obj):
        # Safeguard against unauthenticated users
        user = self.context['request'].user
        if user.is_authenticated:
            participant = CampaignParticipant.objects.filter(campaign=obj, user=user).first()
            return participant.quantity if participant else None
        return None 
    
    def validate(self, data):
        print("Validation data:", data)  # Debugging
        return data

class CampaignParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignParticipant
        fields = '__all__'