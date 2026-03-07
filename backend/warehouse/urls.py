from rest_framework.routers import DefaultRouter
from .views import SkladisteViewSet, SektorViewSet, SlotViewSet


router = DefaultRouter()
router.register(r'skladista', SkladisteViewSet)
router.register(r'sektori', SektorViewSet)
router.register(r'slotovi', SlotViewSet)

urlpatterns = router.urls