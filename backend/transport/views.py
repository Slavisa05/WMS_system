from rest_framework import viewsets
from .serializers import VoziloReadSerializer, VoziloWriteSerializer, TransportReadSerializer, TransportWriteSerializer
from .models import Vozilo, Transport
from core.mixins import SoftDeleteMixin
from core.permissions import IsAdmin, IsZaposlen


class VoziloViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Vozilo.objects.filter(is_active=True).select_related('zaduzeni_vozac')
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsZaposlen()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return VoziloReadSerializer
        return VoziloWriteSerializer 
    

class TransportViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Transport.objects.filter(is_active=True).select_related('vozilo', 'vozilo__zaduzeni_vozac', 'vozac', 'vozac__pozicija').order_by('-datum_polaska')
    permission_classes = [IsZaposlen]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return TransportReadSerializer
        return TransportWriteSerializer