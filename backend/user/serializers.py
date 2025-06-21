
from rest_framework import serializers
from authentication.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'street_address', 'phone_number', 'city', 'zipcode', 'country' ]
