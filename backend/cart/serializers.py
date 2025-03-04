from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Cart, CartItem, Product


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.procut_name")
    product_price = serializers.ReadOnlyField(source="product.actual_price")
    sub_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'product_name', 'product_price', 'cart', 'quantity', 'is_active', 'sub_total']

    def get_sub_total(self, obj):
        return obj.sub_total()
