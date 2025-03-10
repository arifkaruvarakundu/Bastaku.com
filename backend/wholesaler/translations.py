from modeltranslation.translator import register, TranslationOptions
from .models import Product

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('product_name', 'description')

