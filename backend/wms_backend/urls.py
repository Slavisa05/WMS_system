from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/warehouse/', include('warehouse.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/partners/', include('partners.urls')),
    path('api/transport/', include('transport.urls')),
    path('api/documentss/', include('documentss.urls')),
]
