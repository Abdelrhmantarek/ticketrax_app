from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import *
# Register your models here.

# Custom Admin Site Configuration
AdminSite.site_header = "Maharah Administration"  # Admin portal header
AdminSite.site_title = "TicketRax Admin Portal"    # Browser tab title
AdminSite.index_title = "Welcome to TicketRax Admin"  # Dashboard title

# Register Ticket model with Django admin interface
# This enables CRUD operations for tickets in the admin panel
admin.site.register(Ticket)
# Register Activity model with Django admin interface
# This enables viewing and managing ticket activity logs in admin
admin.site.register(Activity)
