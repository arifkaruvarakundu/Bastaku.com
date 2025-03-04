from django.contrib.auth.backends import BaseBackend
from .models import Wholesaler

class WholesalerBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            wholesaler = Wholesaler.objects.get(email=email)
            if wholesaler.check_password(password):
                return wholesaler
        except Wholesaler.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Wholesaler.objects.get(pk=user_id)
        except Wholesaler.DoesNotExist:
            return None
