from rest_framework.routers import DefaultRouter
from .views import PozicijaViewSet, ZaposleniViewSet, me
from django.urls import path

router = DefaultRouter()
router.register(r'pozicije', PozicijaViewSet)
router.register(r'zaposleni', ZaposleniViewSet)

urlpatterns = router.urls + [
    path('me/', me),  
]