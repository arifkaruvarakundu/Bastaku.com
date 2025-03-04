from django.urls import path
from .views import *

urlpatterns = [
    
    path('add_to_cart/', AddToCart.as_view(), name='add-to-cart'),
    path('cart/', CartView.as_view(), name='cart'),
    
    
]