from rest_framework import viewsets
from .serializers import KategorijaSerializer, ProizvodReadSerializer, ProizvodWriteSerializer, ZaliheReadSerializer, ZaliheWriteSerializer
from .models import Kategorija, Proizvod, Zalihe

class KategorijaViewSet(viewsets.ModelViewSet):
    queryset = Kategorija.objects.all()
    serializer_class = KategorijaSerializer


class ProizvodViewSet(viewsets.ModelViewSet):
    queryset = Proizvod.objects.select_related('kategorija')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ProizvodReadSerializer
        return ProizvodWriteSerializer 
    

class ZaliheViewSet(viewsets.ModelViewSet):
    queryset = Zalihe.objects.select_related('proizvod', 'proizvod__kategorija', 'slot', 'slot__sektor', 'slot__sektor__skladiste')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ZaliheReadSerializer
        return ZaliheWriteSerializer 