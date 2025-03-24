from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserProfileSerializer
from authentication.renderers import UserRenderer
from rest_framework.parsers import MultiPartParser, FormParser
from authentication.models import User
from wholesaler.models import Product
from django.http import JsonResponse
from wholesaler.serializers import ProductSerializer

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
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        
        email = request.headers.get('email')
        
        # Ensure the user profile exists
        try:
            user_profile = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        # Update the profile with the new data, without affecting the email field if not changing
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully', 'data': serializer.data})

        return Response({'error': serializer.errors}, status=400)
    
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
        
from authentication.models import ProductCategory
from authentication.serializers import ProductCategorySerializer

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
