
from rest_framework import serializers
from authentication.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'street_address', 'phone_number', 'city', 'zipcode', 'country' ]

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at']

class WholesalerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'company_name', 'email', 'is_active', 'created_at']

class AdminUserDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'is_active', 'user_type',
            'created_at', 'updated_at', 'profile_img', 'street_address','phone_number',
            'city', 'zipcode', 'country'
        ]

class AdminWholesalerDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id', 'email', 'company_name', 'is_active', 'street_address','mobile_number1',
            'mobile_number2', 'mobile_number3', 'city', 'zipcode', 'country', 'license_number',
            'license_image'
        ]

class AdminUserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name','last_name', 'password', 'password2']  # Use `username` instead of `name`
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2', None)
        validated_data['is_admin'] = True  # Force is_admin to True
        return User.objects.create_user(**validated_data)