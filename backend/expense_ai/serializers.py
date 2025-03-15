from rest_framework import serializers
from .models import ExpenseData

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseData
        fields = [
            "family_members", "members_more_than_15", "members_less_than_15",
            "members_more_than_60", "members_less_than_5", "meals_per_day",
            "eating_out_frequency", "dietary_preferences", "total_monthly_expense"
        ]

    def create(self, validated_data):
        # We can customize the creation logic if necessary
        return ExpenseData.objects.create(**validated_data)
