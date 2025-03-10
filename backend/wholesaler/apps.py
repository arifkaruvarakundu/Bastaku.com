from django.apps import AppConfig

class WholesalerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wholesaler'

    def ready(self):
        import wholesaler.translations