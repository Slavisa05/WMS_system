from rest_framework import viewsets
from .serializers import PozicijaSerializer, ZaposleniReadSerializer, ZaposleniWriteSerializer
from .models import Pozicija, Zaposleni
from core.mixins import SoftDeleteMixin
from core.permissions import IsAdmin, IsZaposlen
from rest_framework.filters import SearchFilter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class PozicijaViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Pozicija.objects.filter(is_active=True)
    serializer_class = PozicijaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsZaposlen()]
        return [IsAdmin()]


class ZaposleniViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Zaposleni.objects.filter(is_active=True).select_related('pozicija', 'user').order_by('prezime', 'ime')
    filter_backends = [SearchFilter]
    search_fields = ['ime', 'prezime', 'jmbg']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsZaposlen()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ZaposleniReadSerializer
        return ZaposleniWriteSerializer
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    zaposleni = Zaposleni.objects.select_related('pozicija', 'user')\
        .get(user=request.user)
    serializer = ZaposleniReadSerializer(zaposleni)
    return Response(serializer.data)