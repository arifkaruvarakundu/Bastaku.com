from django.urls import path
from .views import *

urlpatterns = [
    
    path('details/', UserDetailView.as_view(), name='profile'),
    path('profile/update/', UpdateUserProfileUpdationView.as_view(), name='profile-update'),
    path('products/', AllProductsView.as_view(), name='all-products'),
    path('search/', SearchProductsView.as_view(), name='search-products'),
    path('users/customers/', CustomerListView.as_view(), name='customer-list'),
    path('users/wholesalers/', WholesalerListView.as_view(), name='wholesaler-list'),
    path('admin_userdetails/<int:user_id>/', AdminUserDetailsView.as_view(), name='admin-user-details'),
    path('admin_edit_user/<int:user_id>/', AdminEditUserView.as_view(), name='edit-user-profile'),
    path('admin_delete_user/<int:user_id>/', AdminDeleteUserView.as_view(), name='delete-user-profile'),
    path('admin_wholesaler_details/<int:user_id>/', AdminWholesalerDetailsView.as_view(), name='admin-wholesaler-details'),
    path('admin_edit_wholesaler/<int:user_id>/', AdminEditWholesalerView.as_view(), name='edit-wholesaler-profile'),
    path('admin_delete_wholesaler/<int:user_id>/', AdminDeleteWholesalerView.as_view(), name='delete-wholesaler-profile'),
    path('admin_register/', AdminUserRegistrationView.as_view(), name='admin-registration'),

]