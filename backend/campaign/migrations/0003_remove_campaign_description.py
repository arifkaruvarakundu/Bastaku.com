# Generated by Django 5.1.4 on 2025-03-29 08:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('campaign', '0002_remove_campaign_product_campaign_variant'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='campaign',
            name='description',
        ),
    ]
