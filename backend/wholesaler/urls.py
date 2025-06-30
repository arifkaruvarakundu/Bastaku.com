from django.urls import path
from .views import *

urlpatterns = [
    path('wholesaler/details/', WholesalerDetailView.as_view(), name='wholesaler-profile'),
    path('wholesaler/update_profile/', WholesalerProfileUpdationView.as_view(), name='wholesaler-profile-update'),
    path('add_product/', AddProductView.as_view(), name='add-product'),
    path('wholesaler/products/', WholesalerProductsView.as_view(), name='wholesaler-products'),
    # path('wholesaler/product_detail/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('wholesaler/product_edit/<int:pk>/', EditProductView.as_view(), name='product-update'),
    path('product_details/<int:pk>/', ProductDetailView.as_view(), name='user-product-detail'),
    path('wholesaler/add_bank_details/', WholesalerAddBankDetailsView.as_view(), name='wholesaler-bank-details'),
    path('wholesaler/bank_details/', WholesalerBankDetailsView.as_view(), name='wholesaler-bank-details'),
    path('admin_products/', AdminAllProductsView.as_view(), name='all-products'),
    path('admin-delete-product/<int:pk>/', AdminDeleteProductView.as_view(), name='admin-delete-product'),
    path('admin-add-category/', AdminAddCategoryView.as_view(), name='admin-add-category'),
    path('admin-edit-category/<int:pk>/', AdminEditCategoryView.as_view(), name='admin-edit-category'),
    path('category_details/<int:pk>/', CategoryDetailView.as_view(), name = 'category-details'),
    path('deletecategory/<int:pk>/', DeleteCategoryView.as_view(), name = 'delete-category'),

]