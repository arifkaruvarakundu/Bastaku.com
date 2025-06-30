from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from authentication.renderers import UserRenderer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from authentication.models import User
from wholesaler.models import Product
from django.http import JsonResponse
from wholesaler.serializers import ProductSerializer
from authentication.models import ProductCategory
from authentication.serializers import ProductCategorySerializer, UserSerializer
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from authentication.views import get_tokens_for_user

# Create your views here.

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # email = request.headers.get('email')  # Get the email from the custom header
        # if not email:
        #     return Response({'error': 'Email not provided'}, status=status.HTTP_400_BAD_REQUEST)

        # try:
        #     # Fetch the user based on the email
        #     user = User.objects.get(email=email)
        # except User.DoesNotExist:
        #     return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        print(f"Authenticated user: {request.user}")  # Log the authenticated user
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        
        # Prepare the response data
        user_data = {
            "first_name": user.first_name,
            "last_name":user.last_name,
            "email": user.email,
            "street_address": user.street_address,
            "city":user.city,  
            "zipcode": user.zipcode,
            "country": user.country,
            "phone_number": user.phone_number,
            "profile_img": user.profile_img.url if user.profile_img else None  # If using ImageField
        }

        return Response(user_data, status=status.HTTP_200_OK)

  
class UpdateUserProfileUpdationView(APIView):
    
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, *args, **kwargs):
        user_profile = request.user  # safer and correct

        print("Incoming PATCH data:", request.data)  # debug line

        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully', 'data': serializer.data})

        print("Serializer Errors:", serializer.errors)  # debug line
        return Response(serializer.errors, status=400)

# class AllProductsView(APIView):
#     """
#     View to retrieve all products in the system, regardless of wholesaler.
#     """
#     permission_classes = [AllowAny]
#     def get(self, request, *args, **kwargs):
#         try:
#             # Fetch all products
#             products = Product.objects.all()
#             # Serialize the data
#             serializer = ProductSerializer(products, many=True, context={'request': request})
#             return Response(serializer.data, status=status.HTTP_200_OK)
        
#         except Exception as e:
#             print(f"Error retrieving products: {str(e)}")
#             return Response(
#                 {"detail": "An error occurred while retrieving products."},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

class AllProductsView(APIView):
    """
    View to retrieve all products along with their details, first variant, and first variant image.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            # Retrieve all products
            products = Product.objects.all()

            # Serialize the products with their first variant and image
            serializer = ProductSerializer(products, many=True, context={'request': request})

            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error retrieving products: {str(e)}")
            return Response(
                {"detail": "An error occurred while retrieving products."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class SearchProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            query = request.GET.get('query', '').strip()
            if len(query) < 4:
                return JsonResponse({'products': [], 'categories': []})

            # Filter products based on the query
            products = Product.objects.filter(product_name__icontains=query)[:10]  # Limit results
            categories = ProductCategory.objects.filter(name__icontains=query)[:5]  # Limit categories

            product_serializer = ProductSerializer(products, many=True)
            category_serializer = ProductCategorySerializer(categories, many=True)

            return Response({
                'products': product_serializer.data,
                'categories': category_serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"detail": "An error occurred while retrieving search results."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class CustomerListView(ListAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return User.objects.filter(user_type='customer')

class WholesalerListView(ListAPIView):
    serializer_class = WholesalerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return User.objects.filter(user_type='wholesaler')
    
class AdminUserDetailsView(APIView):
    """
    API View to retrieve details of a specific user by their ID.

    This view allows administrators to access detailed information about any user in the system.

    Permissions:
        - IsAdminUser: Only accessible to users with admin privileges.

    Methods:
        - GET: Returns the details of the specified user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """
        Handles GET requests to retrieve a user's details by their ID.

        Expects:
            - user_id: The ID of the user whose details are being requested.

        Returns:
            - 200 OK: If the user is found and details are returned.
            - 404 Not Found: If the user does not exist.
        """
        try:
            user = User.objects.get(id=user_id)
            serializer = AdminUserDetailsSerializer(user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class AdminEditUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User updated successfully', 'data': serializer.data})
        
        return Response(serializer.errors, status=400)
    
class AdminDeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=204)

class AdminWholesalerDetailsView(APIView):
    """
    API View to retrieve details of a specific user by their ID.

    This view allows administrators to access detailed information about any user in the system.

    Permissions:
        - IsAdminUser: Only accessible to users with admin privileges.

    Methods:
        - GET: Returns the details of the specified user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """
        Handles GET requests to retrieve a user's details by their ID.

        Expects:
            - user_id: The ID of the user whose details are being requested.

        Returns:
            - 200 OK: If the user is found and details are returned.
            - 404 Not Found: If the user does not exist.
        """
        try:
            user = User.objects.get(id=user_id)
            serializer = AdminWholesalerDetailsSerializer(user, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class AdminEditWholesalerView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User updated successfully', 'data': serializer.data})
        
        return Response(serializer.errors, status=400)

class AdminDeleteWholesalerView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=204)
        
class AdminUserRegistrationView(APIView):
    """
    API View to handle user registration.

    Allows any user (authenticated or not) to send a POST request to register a new account.
    If the provided data is valid, a new user is created, and a JWT token is returned.
    If invalid, it returns appropriate error messages.

    Permissions:
        - AllowAny: No authentication required.

    Methods:
        - POST: Accepts user data and creates a new user account.
    """
    permission_classes = [AllowAny]

    def post(self, request):

        print("@@################",request.data)
        """
        Handles POST requests for user registration.

        Expects:
            - email: User's email address (required)
            - password: User's password (required)
            - (any other fields defined in the serializer)

        Returns:
            - 201 Created: If registration is successful, returns JWT token and user email.
            - 400 Bad Request: If validation fails, returns serializer error details.
        """
        serializer = AdminUserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token = get_tokens_for_user(user)

            return Response(
                {
                    'token': token,
                    'email': user.email,
                    'msg': 'Registration Success'
                },
                status=status.HTTP_201_CREATED
            )

        # Debug log for serializer validation errors (consider using proper logging in production)
        print("Validation error:", serializer.errors)

        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )