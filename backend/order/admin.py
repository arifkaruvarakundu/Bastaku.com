from django.contrib import admin
from django.urls import path
from .models import *
from django.db.models import Sum
from django.template.response import TemplateResponse 

# Register your models here.

class OrderAdmin(admin.ModelAdmin):

    change_list_template = "admin/orders_change_list.html"  #

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('sales-report/', self.admin_site.admin_view(self.sales_report_view), name="sales-report"),
        ]
        
        return custom_urls + urls

    def sales_report_view(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        orders = Order.objects.all()
        if start_date and end_date:
            orders = orders.filter(
                created_at__date__gte=start_date,
                created_at__date__lte=end_date,
                payment_status='completed'
            )

        total_sales = orders.aggregate(Sum('total_price'))['total_price__sum'] or 0
        total_orders = orders.count()

        context = {
            **self.admin_site.each_context(request),
            'title': 'Sales Report',
            'total_sales': total_sales,
            'total_orders': total_orders,
            'start_date': start_date,
            'end_date': end_date,
        }

        return TemplateResponse(request, "admin/sales_report.html", context)


# Register your model with the admin site
admin.site.register(Order, OrderAdmin)
admin.site.register(CampaignOrder)
admin.site.register(Payment)
admin.site.register(Notification)