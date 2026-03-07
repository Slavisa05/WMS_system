from rest_framework.routers import DefaultRouter
from .views import PoslovniPartnerViewSet

router = DefaultRouter()
router.register(r'partneri', PoslovniPartnerViewSet)

urlpatterns = router.urls