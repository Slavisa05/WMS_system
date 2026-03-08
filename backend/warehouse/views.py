from rest_framework import viewsets
from .serializers import SkladisteSerializer, SektorReadSerializer, SektorWriteSerializer, SlotReadSerializer, SlotWriteSerializer
from .models import Skladiste, Sektor, Slot
from core.mixins import SoftDeleteMixin
from core.permissions import IsAdmin, IsMenadzer, IsZaposlen
from rest_framework.permissions import IsAuthenticated


class SkladisteViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Skladiste.objects.filter(is_active=True)
    serializer_class = SkladisteSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsMenadzer()]
        return [IsAdmin()]


class SektorViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Sektor.objects.filter(is_active=True).select_related('skladiste')
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsMenadzer()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return SektorReadSerializer
        return SektorWriteSerializer


class SlotViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Slot.objects.filter(is_active=True).select_related('sektor', 'sektor__skladiste')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsMenadzer()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return SlotReadSerializer
        return SlotWriteSerializer