from django.urls import path
from .views import *

urlpatterns = [
    
    path('details/', UserDetailView.as_view(), name='profile'),
    path('profile/update/', UpdateUserProfileUpdationView.as_view(), name='profile-update'),
    path('products/', AllProductsView.as_view(), name='all-products'),
    path('search/', SearchProductsView.as_view(), name='search-products'),
    
]