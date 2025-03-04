from rest_framework import serializers
from .models import Campaign, CampaignParticipant
from wholesaler.serializers import ProductSerializer
from wholesaler.models import Product

class CampaignSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    has_ended = serializers.SerializerMethodField()
    product_name = serializers.ReadOnlyField(source='product.product_name')
    wholesaler_name = serializers.ReadOnlyField(source='product.wholesaler.company_name')
    participant_quantity = serializers.SerializerMethodField()
    current_participants = serializers.SerializerMethodField()
    

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
        fields = ['id','product','title','description','discounted_price','start_time','end_time','current_quantity','is_active','participant_quantity','has_ended','product_name','wholesaler_name','current_participants']
        

class CampaignListSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())  # Only the ID is returned
    participant_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = '__all__'

    def get_current_participants(self, obj):
        """Returns the number of participants in the campaign."""
        return obj.participants.count()

class CampaignParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignParticipant
        fields = '__all__'