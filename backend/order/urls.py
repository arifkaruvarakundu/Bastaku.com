from django.urls import path
from .views import *

urlpatterns = [
    path('user_orders/', UserOrdersView.as_view(), name='user-orders'),
    path('wholesaler/orders/', WholesalerOrdersView.as_view(), name='wholesaler-orders'),
    path('advance_payment/', AdvancePaymentView.as_view(), name='create_payment'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/mark-read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('admin-regular-orders/', AdminRegularOrdersView.as_view(), name='admin-regular-orders'),
    path('admin-campaign-orders/', AdminCampaignOrdersView.as_view(), name='admin-campaign-orders'),
    path('admin-regular-order-details/<int:order_id>/', AdminRegularOrderDetailsView.as_view(), name='regular-order-details'),
    path('admin-regular-order-edit/<int:order_id>/', AdminEditRegularOrderView.as_view(), name='regular-order-edit'),
    path('admin-delete-regular-order/<int:order_id>/', AdminDeleteRegularOrderView.as_view(), name='regular-order-delete'),
    path('admin-campaign-order-details/<int:order_id>/', AdminCampaignOrderDetailsView.as_view(), name='campaign-order-details'),
    path('admin-campaign-order-edit/<int:order_id>/', AdminEditCampaignOrderView.as_view(), name='campaign-order-edit'),
    path('admin-delete-campaign-order/<int:order_id>/', AdminDeleteCampaignOrderView.as_view(), name='campaign-order-delete'),

]