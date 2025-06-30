from django.urls import path
from .views import *

urlpatterns = [
    path('campaigns/', CampaignListView.as_view(), name='campaign-list'),
    path('campaigns/<int:pk>/', CampaignDetailView.as_view(), name='campaign-detail'),
    path('campaigns/<int:pk>/join/', JoinCampaignView.as_view(), name='join-campaign'),
    path('start_campaign/', StartCampaignView.as_view(), name='start_campaign'),
    path('wholesaler/campaigns/', WholesalerCampaignsView.as_view(), name='wholesaler_campaigns'),
    path('user_campaigns/', UserCampaignsView.as_view(), name='user_campaigns'),
    path('cancel_campaign/<int:pk>/', CancelCampaignView.as_view(), name='cancel_campaign'),
    path('admin_campaigns/', AdminCampaignsView.as_view(), name='admin_campaigns'),
    path('admin-start-campaign/<int:pk>/', AdminStartCampaignView.as_view(), name='admin-start-campaign'),
    path('admin-campaign-details/<int:pk>/', AdminCampaignDetailsView.as_view(), name='admin-campaign-details')


]  # Closing the urlpatterns list