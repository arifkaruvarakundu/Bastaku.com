from django.db import models
from authentication.models import User
# Create your models here.

class ExpenseData(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='expenseData')
    family_members = models.IntegerField()
    members_more_than_15 = models.IntegerField()
    members_less_than_15 = models.IntegerField()
    members_more_than_60 = models.IntegerField()
    members_less_than_5 = models.IntegerField()
    meals_per_day = models.IntegerField()
    eating_out_frequency = models.IntegerField()
    dietary_preferences = models.TextField()
    total_monthly_expense = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Expense Data - {self.user}"
