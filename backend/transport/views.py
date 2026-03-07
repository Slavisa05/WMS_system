from rest_framework import viewsets
from .serializers import VoziloReadSerializer, VoziloWriteSerializer, TransportReadSerializer, TransportWriteSerializer
from .models import Vozilo, Transport


class VoziloViewSet(viewsets.ModelViewSet):
    queryset = Vozilo.objects.select_related('zaduzeni_vozac')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return VoziloReadSerializer
        return VoziloWriteSerializer 
    

class TransportViewSet(viewsets.ModelViewSet):
    queryset = Transport.objects.select_related('vozilo', 'vozilo__zaduzeni_vozac', 'vozac', 'vozac__pozicija')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return TransportReadSerializer
        return TransportWriteSerializer