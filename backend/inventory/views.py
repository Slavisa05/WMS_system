from rest_framework import viewsets
from rest_framework.viewsets import ReadOnlyModelViewSet
from .serializers import KategorijaSerializer, ProizvodReadSerializer, ProizvodWriteSerializer, ZaliheReadSerializer
from .models import Kategorija, Proizvod, Zalihe
from core.mixins import SoftDeleteMixin
from core.permissions import IsMenadzer, IsZaposlen
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class KategorijaViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Kategorija.objects.filter(is_active=True)
    serializer_class = KategorijaSerializer

    def get_permissions(self):
        return [IsMenadzer()]


class ProizvodViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Proizvod.objects.select_related('kategorija')
    filterset_fields = ['kategorija']
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['kategorija']
    search_fields = ['naziv', 'barkod', 'sifra']

    def get_permissions(self):
        return [IsMenadzer()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ProizvodReadSerializer
        return ProizvodWriteSerializer 
    

class ZaliheViewSet(ReadOnlyModelViewSet):
    queryset = Zalihe.objects.filter(is_active=True).select_related('proizvod', 'proizvod__kategorija', 'slot', 'slot__sektor', 'slot__sektor__skladiste')
    serializer_class = ZaliheReadSerializer
    permission_classes = [IsZaposlen]
    filterset_fields = ['proizvod', 'slot', 'slot__sektor', 'slot__sektor__skladiste']