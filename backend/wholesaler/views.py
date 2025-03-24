from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import WholesalerBankDetailsSerializer, WholesalerProfileSerializer, ProductSerializer
from authentication.models import Wholesaler,ProductCategory
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Product,WholesalerBankDetails,ProductVariantImage,ProductVariant, ProductVariantImage
from rest_framework.exceptions import ValidationError
from .utils import upload, destroy  # Cloudinary utility functions
import json
from decimal import Decimal, InvalidOperation
from django.core.files.uploadedfile import InMemoryUploadedFile
import decimal
import traceback
import cloudinary.uploader

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

class AddProductView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print("Received Data:", data)

            # Fetch category instance
            category_id = data.get("category")
            category_instance = ProductCategory.objects.get(id=category_id)

            # Fetch wholesaler instance
            wholesaler_email = data.get("wholesaler")
            wholesaler_instance = Wholesaler.objects.get(email=wholesaler_email)

            # Create the product
            product = Product.objects.create(
                product_name=data.get("product_name"),
                product_name_en=data.get("product_name_en"),
                product_name_ar=data.get("product_name_ar"),
                description=data.get("description"),
                description_en=data.get("description_en"),
                description_ar=data.get("description_ar"),
                category=category_instance,
                wholesaler=wholesaler_instance,
            )

            # Handle variants
            variants = json.loads(data.get("variants", "[]"))
           
            # Extract images from request.FILES (now we correctly map variant_images)
            variant_images_files = [file for key, file in request.FILES.items() if key.startswith("variant_images")]

            print(variant_images_files)

            # Iterate over each variant and handle its data and image (if provided)
            for index, variant_data in enumerate(variants):
                

                # Convert price and discount values to Decimal
                weight = decimal.Decimal(variant_data.get("weight"))
                liter = decimal.Decimal(variant_data.get("liter"))  # Avoid empty string
                price = decimal.Decimal(variant_data.get("price"))
                campaign_discount_percentage = decimal.Decimal(variant_data.get("campaign_discount_percentage") or 0)
                minimum_order_quantity_for_offer = decimal.Decimal(variant_data.get("minimum_order_quantity_for_offer") or 0)

                # Create the variant
                variant = ProductVariant.objects.create(
                    product=product,
                    brand=variant_data.get("brand"),
                    weight=weight,
                    liter=liter,
                    price=price,
                    stock=variant_data.get("stock"),
                    campaign_discount_percentage=campaign_discount_percentage,
                    minimum_order_quantity_for_offer=minimum_order_quantity_for_offer
                )

                # Handle variant-specific images (if exists)
                images = variant_data.get("images", [])
                for image_index, image_data in enumerate(images):
                    print(f"Processing image {image_index} for variant {index}")
                    try:
                        image_file = variant_images_files.pop(0)  # Get the image file for this index

                        # Upload image to Cloudinary
                        upload_result = cloudinary.uploader.upload(image_file)
                        image_url = upload_result["secure_url"]  # Cloudinary image URL
                        public_id = upload_result["public_id"]  # Cloudinary public ID

                        # Create ProductVariantImage instance for this variant
                        ProductVariantImage.objects.create(
                            variant=variant,
                            image_url=image_url,
                            public_id=public_id,
                            product=product
                        )
                    except Exception as e:
                        print(f"Error uploading image for variant {index}, image {image_index}: {e}")
                        return Response({"error": f"Image upload failed for variant {index}, image {image_index}: {str(e)}"},
                                        status=status.HTTP_400_BAD_REQUEST)

            # Return success response
            return Response({"message": "Product and variants added successfully!"}, status=status.HTTP_201_CREATED)

        except ProductCategory.DoesNotExist:
            return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)

        except Wholesaler.DoesNotExist:
            return Response({"error": "Wholesaler not found with this email"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class WholesalerProductsView(APIView):
#     permission_classes = [AllowAny]  

#     def get(self, request, *args, **kwargs):
#         # Retrieve the email from query parameters
#         email = request.query_params.get('email')
#         if not email:
#             return Response({"error": "Email is required"}, status=400)

#         # Get the wholesaler object
#         wholesaler = Wholesaler.objects.get(email=email)

#         # Filter products by the wholesaler
#         products = Product.objects.filter(wholesaler=wholesaler)

#         # Serialize the product data
#         serializer = ProductSerializer(products, many=True)
#         return Response(serializer.data)

class WholesalerProductsView(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, *args, **kwargs):
        # Retrieve the email from query parameters
        email = request.query_params.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get the wholesaler object
            wholesaler = Wholesaler.objects.get(email=email)

            # Filter products by the wholesaler
            products = Product.objects.filter(wholesaler=wholesaler)

            # Build response with first variant and first image
            product_list = []
            for product in products:
                first_variant = product.variants.first()  # Get the first variant
                first_variant_image = None
                
                if first_variant:
                    first_variant_image = first_variant.variant_images.first()  # Get the first image

                product_data = {
                    "id": product.id,
                    "product_name": product.product_name,
                    "product_name_en": product.product_name_en,
                    "product_name_ar": product.product_name_ar,
                    "description": product.description,
                    "is_in_campaign": product.is_in_campaign,
                    "is_available": product.is_available,
                    "category": product.category.id if product.category else None,
                    "wholesaler": product.wholesaler.id if product.wholesaler else None,
                    "created_date": product.created_date,
                    "modified_date": product.modified_date,
                    "slug": product.slug,
                    "first_variant": {
                        "id": first_variant.id if first_variant else None,
                        "brand": first_variant.brand if first_variant else None,
                        "weight": str(first_variant.weight) if first_variant and first_variant.weight else None,
                        "liter": str(first_variant.liter) if first_variant and first_variant.liter else None,
                        "price": str(first_variant.price) if first_variant else None,
                        "stock": first_variant.stock if first_variant else None,
                        "campaign_discount_percentage": str(first_variant.campaign_discount_percentage) if first_variant else None,
                    } if first_variant else None,
                    "first_variant_image_url": first_variant_image.image_url if first_variant_image else None,
                }

                product_list.append(product_data)

            return Response(product_list, status=status.HTTP_200_OK)

        except Wholesaler.DoesNotExist:
            return Response({"error": "Wholesaler not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error retrieving wholesaler products: {str(e)}")
            return Response(
                {"detail": "An error occurred while retrieving wholesaler products."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
# class ProductDetailView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request, pk, *args, **kwargs):
#         try:
#             product = Product.objects.get(pk=pk)
#             serializer = ProductSerializer(product)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Product.DoesNotExist:
#             return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.prefetch_related("variants__variant_images").get(pk=pk)  
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    


class EditProductView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads

    def put(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update product details
        product.product_name_en = request.data.get("product_name_en", product.product_name_en)
        product.product_name_ar = request.data.get("product_name_ar", product.product_name_ar)
        product.description_en = request.data.get("description_en", product.description_en)
        product.description_ar = request.data.get("description_ar", product.description_ar)

        # Update category
        category_id = request.data.get("category")
        if category_id:
            try:
                category = ProductCategory.objects.get(id=category_id)
                product.category = category
            except ProductCategory.DoesNotExist:
                return Response({"detail": "Invalid category ID."}, status=status.HTTP_400_BAD_REQUEST)

        # Process variants
        variants_data = request.data.get("variants", [])

        if isinstance(variants_data, str):
            try:
                variants_data = json.loads(variants_data)
            except json.JSONDecodeError:
                return Response({"detail": "Invalid variants data format."}, status=status.HTTP_400_BAD_REQUEST)

        # Track existing variant IDs
        existing_variant_ids = {variant.id for variant in product.variants.all()}

        def parse_decimal(value):
            try:
                return Decimal(value) if value not in [None, "", "null"] else None
            except InvalidOperation:
                return None

        # Process each variant sent from the frontend
        for variant_index, variant_data in enumerate(variants_data):
            variant_id = variant_data.get("id")

            if variant_id and int(variant_id) in existing_variant_ids:
                # Update existing variant
                variant = ProductVariant.objects.get(id=int(variant_id))
                existing_variant_ids.remove(int(variant_id))  # Mark as updated
            else:
                # Create new variant
                variant = ProductVariant.objects.create(
                    product=product,
                    brand=variant_data.get("brand", ""),
                    weight=parse_decimal(variant_data.get("weight")),
                    liter=parse_decimal(variant_data.get("liter")),
                    price=parse_decimal(variant_data.get("price")),
                    stock=parse_decimal(variant_data.get("stock")),
                    campaign_discount_percentage=parse_decimal(variant_data.get("campaign_discount_percentage")),
                    minimum_order_quantity_for_offer=parse_decimal(variant_data.get("minimum_order_quantity_for_offer")),
                )

            # Update variant fields (for both new and existing variants)
            variant.brand = variant_data.get("brand", variant.brand)
            variant.weight = parse_decimal(variant_data.get("weight"))
            variant.liter = parse_decimal(variant_data.get("liter"))
            variant.price = parse_decimal(variant_data.get("price"))
            variant.stock = parse_decimal(variant_data.get("stock"))
            variant.campaign_discount_percentage = parse_decimal(variant_data.get("campaign_discount_percentage"))
            variant.minimum_order_quantity_for_offer = parse_decimal(variant_data.get("minimum_order_quantity_for_offer"))
            variant.save()

            # Handle images marked for deletion
            images_to_delete = variant_data.get("imagesToDelete", [])
            for image_id in images_to_delete:
                try:
                    image = ProductVariantImage.objects.get(id=image_id)
                    destroy(image.public_id)  # Delete from Cloudinary
                    image.delete()  # Remove from database
                except ProductVariantImage.DoesNotExist:
                    pass  # Ignore if the image doesn't exist

            # Handle new images
            variant_files_key = f"new_images_{variant_index}_"
            for key, image_file in request.FILES.items():
                if key.startswith(variant_files_key):
                    uploaded_image = upload(image_file)
                    ProductVariantImage.objects.create(
                        variant=variant,
                        image_url=uploaded_image["secure_url"],
                        public_id=uploaded_image["public_id"],
                    )

        # Delete variants that were not included in the request
        for old_variant in product.variants.filter(id__in=existing_variant_ids):
            for image in old_variant.variant_images.all():
                destroy(image.public_id)  # Delete from Cloudinary
                image.delete()
            old_variant.delete()

        # Save product
        product.save()

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
