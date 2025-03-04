from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken

class DisableCSRFForAPIs:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/register/'):  # Apply to specific routes
            setattr(request, '_dont_enforce_csrf_checks', True)
        return self.get_response(request)
    
class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get('access_token')

        if access_token:
            try:
                validated_token = AccessToken(access_token)
                user = JWTAuthentication().get_user(validated_token)
                request.user = user  # Set the user in request
            except Exception as e:
                print(f"JWT Middleware Error: {e}")
                request.user = None