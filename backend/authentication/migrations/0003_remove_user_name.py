# Generated by Django 5.1.4 on 2025-03-09 11:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_user_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
    ]
