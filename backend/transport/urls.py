from rest_framework.routers import DefaultRouter
from .views import VoziloViewSet, TransportViewSet

router = DefaultRouter()
router.register(r'vozila', VoziloViewSet)
router.register(r'transporti', TransportViewSet)

urlpatterns = router.urls