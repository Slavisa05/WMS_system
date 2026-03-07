from rest_framework.routers import DefaultRouter
from .views import DokumentViewSet, StavkeDokumentaViewSet

router = DefaultRouter()
router.register(r'dokumenta', DokumentViewSet)
router.register(r'stavke_dokumenata', StavkeDokumentaViewSet)

urlpatterns = router.urls