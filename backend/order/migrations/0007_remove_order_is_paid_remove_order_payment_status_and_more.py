# Generated by Django 5.1.4 on 2025-06-29 07:11

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0006_campaignorder_status'),
        ('wholesaler', '0015_alter_productvariant_minimum_order_quantity_for_offer_by_admin_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='is_paid',
        ),
        migrations.RemoveField(
            model_name='order',
            name='payment_status',
        ),
        migrations.RemoveField(
            model_name='order',
            name='quantity',
        ),
        migrations.RemoveField(
            model_name='order',
            name='total_price',
        ),
        migrations.RemoveField(
            model_name='order',
            name='variant',
        ),
        migrations.AddField(
            model_name='order',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='order.order')),
                ('product_variant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='wholesaler.productvariant')),
            ],
        ),
    ]
