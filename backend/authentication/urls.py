from django.urls import path
from authentication.views import *
from .views import ProductCategoryList
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

urlpatterns = [
    path('register/',UserRegistrationView.as_view(),name="register"),
    path('login/',UserLoginView.as_view(),name="login"),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('productcategories/', ProductCategoryList.as_view(), name='product-category-list'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('wholesaler/register/', WholesalerRegistrationView.as_view(), name='wholesaler-register'),
    path('wholesaler/login/', WholesalerLoginView.as_view(), name='wholesaler-login'),
    path('wholesaler/logout/', WholesalerLogoutView.as_view(), name='wholesaler-logout'),
    path('api/token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer)),
    path('current_user/', CurrentUserView.as_view(), name='current_user'),
    path('update_profile_image/', ProfileImageUpdateView.as_view(), name='update-profile-image'),
    path('api/admin-login/', AdminLoginView.as_view(), name='admin_login'),
    
]