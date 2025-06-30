from rest_framework import serializers
from .models import Campaign, CampaignParticipant
from wholesaler.serializers import ProductVariantSerializer
from wholesaler.models import Product, ProductVariant
from order.serializers import MinimalVariantSerializer

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
    
    # def create(self, validated_data):
    #     user = self.context['request'].user
    #     return Campaign.objects.create(started_by=user, **validated_data)

class CampaignParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignParticipant
        fields = '__all__'

class AdminCampaignListSerializer(serializers.ModelSerializer):
    variant = MinimalVariantSerializer(read_only=True)
    product_name = serializers.SerializerMethodField()
    current_participants = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = ['id', 'product_name', 'variant', 'start_time', 'end_time', 'current_quantity', 'is_active', 'current_participants']

    def get_current_participants(self, obj):
        """Returns the number of participants in the campaign."""
        return obj.participants.count()
    
    def get_product_name(self, obj):
        return obj.variant.product.product_name if obj.variant and obj.variant.product else None

class AdminCampaignParticipantSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = CampaignParticipant
        fields = ['id', 'email', 'first_name', 'last_name', 'quantity', 'joined_at']

class AdminCampaignSerializer(serializers.ModelSerializer):
    variant = MinimalVariantSerializer(read_only=True)
    current_participants = serializers.IntegerField(read_only=True)
    participants = AdminCampaignParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = [
            'id',
            'variant',
            'title',
            'discounted_price',
            'start_time',
            'end_time',
            'current_quantity',
            'is_active',
            'started_by',
            'current_participants',
            'participants',  # Nested participant details
        ]