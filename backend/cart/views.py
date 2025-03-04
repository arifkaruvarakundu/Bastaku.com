from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cart, CartItem
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from wholesaler.models import Product
from authentication.models import User
from django.http import JsonResponse
from .serializers import CartItemSerializer

class AddToCart(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        
        email = request.data.get('email')  # Get email from the request
        product_id = request.data.get('product_id')  # Get product_id from the request
        quantity = request.data.get('quantity')  # Get quantity from the request

        try:
            # Validate product
            product = Product.objects.get(id=product_id)
            
            if product.stock < int(quantity):
                return Response({'success': False, 'message': 'Not enough stock available.'}, status=400)

            # Get or create the user
            user = User.objects.get(email=email)
            

            # Get or create a cart
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
            cart, _ = Cart.objects.get_or_create(cart_id=request.session.session_key)

            # Check if the cart item already exists
            cart_item = CartItem.objects.filter(cart=cart, product=product).first()

            if cart_item:
                return Response({'success': False, 'message': 'Product is already in the cart.'}, status=400)

            # Check if the cart item already exists
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity, 'user': user, 'is_active': True}
            )

            # Update the quantity if it already exists
            if not created:
                cart_item.quantity += int(quantity)
                cart_item.save()

            # Serialize the cart item
            serializer = CartItemSerializer(cart_item)
            return Response({'success': True, 'data': serializer.data, 'message': 'Product added to cart successfully.'})

        except Product.DoesNotExist:
            return Response({'success': False, 'message': 'Product not found.'}, status=404)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=500)


class CartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Retrieve cart items for the current session
        
        cart_id = request.session.get('cart_id')
        if not cart_id:
            return JsonResponse({"items": [], "total_price": 0, "coupon_discount": 0, "final_price": 0})

        cart_items = CartItem.objects.filter(cart__cart_id=cart_id, is_active=True)
        items = [
            {
                "id": item.id,
                "product_name": item.product.name,
                "price": item.product.price,
                "quantity": item.quantity,
                "stock": item.product.stock,
                "product_image": item.product.images.first().image.url if item.product.images.exists() else None,
            }
            for item in cart_items
        ]
        total_price = sum(item.product.price * item.quantity for item in cart_items)
        coupon_discount = 0  # Implement coupon logic
        final_price = total_price - coupon_discount

        return JsonResponse({
            "items": items,
            "total_price": total_price,
            "coupon_discount": coupon_discount,
            "final_price": final_price,
        })
    
