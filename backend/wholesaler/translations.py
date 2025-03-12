from modeltranslation.translator import register, TranslationOptions
from .models import Product,WholesalerBankDetails

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('product_name', 'description')

@register(WholesalerBankDetails)
class BankDetailsTranslationOptions(TranslationOptions):
    fields = ('beneficiary_name', 'bank_name', 'bank_address')

