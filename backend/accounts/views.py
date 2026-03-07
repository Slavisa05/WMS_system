from rest_framework import viewsets
from .serializers import PozicijaSerializer, ZaposleniReadSerializer, ZaposleniWriteSerializer
from .models import Pozicija, Zaposleni


class PozicijaViewSet(viewsets.ModelViewSet):
    queryset = Pozicija.objects.all()
    serializer_class = PozicijaSerializer


class ZaposleniViewSet(viewsets.ModelViewSet):
    queryset = Zaposleni.objects.select_related('pozicija', 'user')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ZaposleniReadSerializer
        return ZaposleniWriteSerializer
    