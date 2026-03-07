from rest_framework.routers import DefaultRouter
from .views import KategorijaViewSet, ProizvodViewSet, ZaliheViewSet

router = DefaultRouter()
router.register(r'kategorije', KategorijaViewSet)
router.register(r'proizvodi', ProizvodViewSet)
router.register(r'zalihe', ZaliheViewSet)

urlpatterns = router.urls