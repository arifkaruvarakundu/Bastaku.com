from django.contrib.auth.backends import BaseBackend
from .models import User

class WholesalerBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            wholesaler = User.objects.get(email=email, user_type = "wholesaler")
            if wholesaler.check_password(password):
                return wholesaler
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id, user_type = "wholesaler")
        except User.DoesNotExist:
            return None
