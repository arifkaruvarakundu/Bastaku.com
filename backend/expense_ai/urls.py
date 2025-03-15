from django.urls import path
from .views import CalculateExpenseView

urlpatterns = [
    path("calculate_expense/", CalculateExpenseView.as_view(), name="calculate-expense"),
]