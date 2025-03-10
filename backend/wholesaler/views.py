from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import WholesalerBankDetailsSerializer, WholesalerProfileSerializer, ProductSerializer,ProductCreateSerializer
from authentication.models import Wholesaler,ProductCategory
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Product,WholesalerBankDetails,ProductImage


# Create your views here.
class WholesalerDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        email = request.headers.get('email')  # Get the email from the custom header
        
        if not email:
            return Response({'error': 'Email not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the user based on the email
            user = Wholesaler.objects.get(email=email)
        except Wholesaler.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

        # Prepare the response data
        user_data = {
            "company_name": user.company_name,
            "email": user.email,
            "street_address": user.street_address,  # Assuming these fields exist in the UserProfile model
            "zipcode": user.zipcode,
            "country": user.country,
            "mobile_number1": user.mobile_number1,
            "mobile_number2": user.mobile_number2,
            "mobile_number3": user.mobile_number3,
            "license_number": user.license_number,
            "license_image": user.license_image.url if user.license_image else None  # If using ImageField
        }

        return Response(user_data, status=status.HTTP_200_OK)
    
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.uploadedfile import InMemoryUploadedFile

class WholesalerProfileUpdationView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        
        email = request.headers.get('email')
        try:
            user_profile = Wholesaler.objects.get(email=email)
        except Wholesaler.DoesNotExist:
            return Response({"error": "Wholesaler not found"}, status=404)

        # Handle license_image: only save if a new file is provided
        if 'license_image' in request.data:
            license_image = request.data['license_image']
            if isinstance(license_image, InMemoryUploadedFile):
                user_profile.license_image = license_image
            else:
                return Response({"error": "Invalid file provided"}, status=400)

        # Use the serializer for other fields
        serializer = WholesalerProfileSerializer(
            user_profile, 
            data={k: v for k, v in request.data.items() if k != 'license_image'},
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully', 'data': serializer.data})
        
        return Response(serializer.errors, status=400)


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import traceback 
import cloudinary.uploader

class AddProductView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print("Received Data:", data)

            # Get all image files correctly
            files = [file for key, file in request.FILES.items() if "product_images" in key]
            

            # Fetch category instance
            category_id = data.get("category")
            category_instance = ProductCategory.objects.get(id=category_id)

            # Fetch wholesaler instance
            wholesaler_email = request.data.get("wholesaler")
            wholesaler_instance = Wholesaler.objects.get(email=wholesaler_email)

            # Create the product
            product = Product.objects.create(
                product_name=data.get("product_name"),
                product_name_en=data.get("product_name_en"),
                product_name_ar=data.get("product_name_ar"),
                description=data.get("description"),
                description_en=data.get("description_en"),
                description_ar=data.get("description_ar"),
                actual_price=data.get("actual_price"),
                stock=data.get("stock"),
                category=category_instance,
                campaign_discount_percentage=data.get("campaign_discount_percentage"),
                minimum_order_quantity_for_offer=data.get("minimum_order_quantity_for_offer"),
                wholesaler=wholesaler_instance,
            )
            

            # Upload images to Cloudinary
            for file in files:
                print("Uploading file to Cloudinary:", file.name)

                upload_result = cloudinary.uploader.upload(file)
                image_url = upload_result["secure_url"]  # Get Cloudinary image URL
                public_id = upload_result["public_id"]  # Get Cloudinary public ID

                

                # Save the image URL & public ID in ProductImage model
                ProductImage.objects.create(
                    product=product,
                    image_url=image_url,  # Cloudinary URL
                    public_id=public_id  # Cloudinary Public ID
                )

            return Response({"message": "Product added successfully!"}, status=status.HTTP_201_CREATED)

        except ProductCategory.DoesNotExist:
            return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)

        except Wholesaler.DoesNotExist:
            return Response({"error": "Wholesaler not found with this email"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            traceback.print_exc() 
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WholesalerProductsView(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, *args, **kwargs):
        # Retrieve the email from query parameters
        email = request.query_params.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=400)

        # Get the wholesaler object
        wholesaler = Wholesaler.objects.get(email=email)

        # Filter products by the wholesaler
        products = Product.objects.filter(wholesaler=wholesaler)

        # Serialize the product data
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
from rest_framework.parsers import MultiPartParser, FormParser
from cloudinary.uploader import destroy, upload  #  Import Cloudinary functions
from rest_framework.exceptions import ValidationError

class EditProductView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads

    def put(self, request, pk, *args, **kwargs):
        try:
            print(request.data)  # Debugging print
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update product details (excluding images)
        product.product_name = request.data.get("product_name", product.product_name)
        product.actual_price = request.data.get("actual_price", product.actual_price)
        product.campaign_discount_percentage = request.data.get(
            "campaign_discount_percentage", product.campaign_discount_percentage
        )
        product.description = request.data.get("description", product.description)
        product.stock = request.data.get("stock", product.stock)

        # Fetch the category object based on the category ID provided in the request
        category_id = request.data.get("category")
        if category_id:
            try:
                category = ProductCategory.objects.get(id=category_id)
                product.category = category  # Assign the ProductCategory instance
            except ProductCategory.DoesNotExist:
                raise ValidationError({"category": "Invalid category ID."})
        else:
            # If no category is provided, retain the current category
            product.category = product.category

        product.minimum_order_quantity_for_offer = request.data.get(
            "minimum_order_quantity_for_offer", product.minimum_order_quantity_for_offer
        )

        # 2. Delete old Cloudinary images before updating
        old_images = product.product_images.all()  # Assuming a related model
        
        for img in old_images:
            destroy(img.public_id)  # Deletes from Cloudinary
            img.delete()  # Deletes from the database

        # 3. Upload new images to Cloudinary (Handle multiple files)
        if "product_images" in request.FILES:
            # Loop through all the uploaded files under "product_images"
            for image_file in request.FILES.getlist("product_images"):
                uploaded_image = upload(image_file)  # Upload to Cloudinary
                image_url = uploaded_image["secure_url"]
                public_id = uploaded_image["public_id"]

                # Save image URL & public_id in the database
                product_image = ProductImage.objects.create(
                    product=product, image_url=image_url, public_id=public_id
                )

        # Save updated product details after images are uploaded
        product.save()  # Save updated product details

        return Response({"detail": "Product updated successfully!"}, status=status.HTTP_200_OK)



class WholesalerBankDetailsView(APIView):
    permission_classes = [AllowAny]  # No authentication required

    def get(self, request, *args, **kwargs):
        try:
            email = request.GET.get("email")  # Get email from query params
            if not email:
                return Response({"error": "Email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

            wholesaler = Wholesaler.objects.filter(email=email).first()
            if not wholesaler:
                return Response({"error": "Wholesaler not found"}, status=status.HTTP_404_NOT_FOUND)

            bank_details = WholesalerBankDetails.objects.filter(wholesaler=wholesaler)

            if not bank_details.exists():
                return Response({"detail": "Bank details not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = WholesalerBankDetailsSerializer(bank_details, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WholesalerAddBankDetailsView(APIView):
    """
    API endpoint for Wholesaler to add banking details.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        wholesaler_email = request.headers.get('Email')  # Use .get() to access data safely

        if wholesaler_email:
            try:
                # Fetch the wholesaler using email
                wholesaler = Wholesaler.objects.get(email=wholesaler_email)
                print(wholesaler)
            except Wholesaler.DoesNotExist:
                return Response({"detail": "Wholesaler not found."}, status=404)
        else:
            return Response({"detail": "Wholesaler email is required."}, status=400)

        # Include wholesaler in the data passed to the serializer
        data = request.data.copy()  # Make a copy to modify it
        data['wholesaler'] = wholesaler.id  # Add wholesaler ID to the data

        # Pass the wholesaler to the serializer
        serializer = WholesalerBankDetailsSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            print("Serializer Errors:", serializer.errors)  # Debugging
            return Response({"error": serializer.errors}, status=400)
        

