from rest_framework import viewsets
from .serializers import PozicijaSerializer, ZaposleniReadSerializer
from .models import Pozicija, Zaposleni


class PozicijaViewSet(viewsets.ModelViewSet):
    queryset = Pozicija.objects.all()
    serializer_class = PozicijaSerializer


class ZaposleniViewSet(viewsets.ModelViewSet):
    queryset = Zaposleni.objects.select_related('pozicija', 'user')
    serializer_class = ZaposleniReadSerializer
    