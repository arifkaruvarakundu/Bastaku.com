from rest_framework.response import Response
from twilio.rest import Client
from rest_framework import status
from rest_framework.views import APIView
from authentication.serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendPasswordResetEmailSerializer,UserPasswordResetSerializer
from authentication.renderers import UserRenderer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.exceptions import AuthenticationFailed
from .models import ProductCategory, User
from .serializers import ProductCategorySerializer
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]  # Allow all users to access this view
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        print("Request data:", request.data)
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response(
                {'token': token, 'user_type': user.user_type, 'msg': 'Registration Success'},
                status=status.HTTP_201_CREATED
            )
        else:
            print("Validation errors:", serializer.errors)
            return Response(
                {"errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        print("requestdata@@@@@@@@@@@",request.data)
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.data.get('email')
        user = User.objects.get(email=email, user_type="customer")
        password = serializer.data.get('password')

        # Authenticate the user
        user = authenticate(email=email, password=password)

        if user is not None:
            # Check if profile image exists
            profile_img_url = None
            if user.profile_img:
                profile_img_url = user.profile_img.url  # This returns the URL of the profile image

            # Generate the authentication token
            token = get_tokens_for_user(user)

            # Return the response with the necessary data
            return Response({
                'token': token,
                'msg': 'Login Success',
                'first_name': user.first_name,
                'last_name':user.last_name,
                'email': user.email,
                'profile_img': profile_img_url,
                'user_type': user.user_type
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'errors': {'non_field_errors': ['Email or Password is not Valid']}
            }, status=status.HTTP_404_NOT_FOUND)
    

class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

  
class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
  

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            raise AuthenticationFailed('Refresh token is required')

        try:
            # Decode and blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()  # This invalidates the refresh token
            return Response({"msg": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            raise AuthenticationFailed('Invalid refresh token or token not blacklisted')
        
######################################################################################################################################################

from .serializers import WholesalerRegistrationSerializer, WholesalerLoginSerializer

def get_tokens_for_wholesaler(wholesaler):
    refresh = RefreshToken()
    refresh['user_id'] = str(wholesaler.id)
    refresh['company_name'] = wholesaler.company_name  # Include additional data if needed
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class WholesalerRegistrationView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = WholesalerRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        wholesaler = serializer.save()
        token = get_tokens_for_wholesaler(wholesaler)
        phone_number = wholesaler.mobile_number1
        if phone_number:
            self.send_whatsapp_message(phone_number)
        return Response({'token': token, 'user_type':wholesaler.user_type, 'msg': 'Registration Success'}, status=status.HTTP_201_CREATED)
    
    def send_whatsapp_message(self, phone_number):
        # Twilio credentials (should be stored in environment variables or a secure place)
        account_sid = os.getenv("account_sid")
        auth_token = os.getenv("auth_token")
        from_whatsapp_number = os.getenv("from_whatsapp_number")  # Twilio's sandbox WhatsApp number or your own Twilio number

        # Initialize Twilio client
        client = Client(account_sid, auth_token)

        # Send the WhatsApp message
        message = client.messages.create(
            body="Welcome to Bastaku,You have successfully registered!",
            from_=from_whatsapp_number,
            to=f'whatsapp:{phone_number}'  # Make sure the number is in the correct format
        )

        print(f"WhatsApp message sent to {phone_number}, SID: {message.sid}")
        
from django.contrib.auth import authenticate

class WholesalerLoginView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = WholesalerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        user = User.objects.get(email=email, user_type = "wholesaler")
        password = serializer.data.get('password')

        wholesaler = authenticate(request, email=email, password=password)  # Custom backend is used here
        if wholesaler is not None:
            token = get_tokens_for_wholesaler(wholesaler)
            return Response({'token': token, 'msg': 'Login Successful','company_name':user.company_name,'email':user.email, 'user_type':user.user_type}, status=status.HTTP_200_OK)
        else:
            return Response({'errors': {'non_field_errors': ['Email or Password is not valid']}}, 
                            status=status.HTTP_404_NOT_FOUND)

class WholesalerLogoutView(APIView):
    """
    View to handle logout for wholesalers. It blacklists the refresh token.
    """
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            raise AuthenticationFailed('Refresh token is required')

        try:
            # Decode and blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklists the token to invalidate it
            return Response({"msg": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            raise AuthenticationFailed('Invalid refresh token or token not blacklisted')

class ProductCategoryList(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        categories = ProductCategory.objects.all()
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# class WholesalerProfileView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def get(self, request, format=None):
#         serializer = WholesalerProfileSerializer(request.user)
#         return Response(serializer.data, status=status.HTTP_200_OK)


from datetime import timedelta
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(APIView):
    def post(self, request, *args, **kwargs):
        # Get user credentials and generate tokens
        email = request.data.get("email")
        password = request.data.get("password")
        
        # Authenticate the user
        user = authenticate(email=email, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Create response manually
        response = Response(
            {
                "message": "Login successful",
                "user_type": "wholesaler" if user.is_wholesaler else "individual",
            },
            status=200
        )

    def set_jwt_cookie(response, user):
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=60*60*24,
                expires=timezone.now() + timedelta(days=1)
            )
            
            return response