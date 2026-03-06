from rest_framework.routers import DefaultRouter
from .views import PozicijaViewSet, ZaposleniViewSet

router = DefaultRouter()
router.register(r'pozicije', PozicijaViewSet)
router.register(r'zaposleni', ZaposleniViewSet)

urlpatterns = router.urls