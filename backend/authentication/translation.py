from modeltranslation.translator import register, TranslationOptions
from .models import ProductCategory

@register(ProductCategory)
class ProductTranslationOptions(TranslationOptions):
    fields = ('name',)
