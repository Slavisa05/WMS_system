from rest_framework import viewsets
from .serializers import DokumentReadSerializer, DokumentWriteSerializer, StavkeDokumentaReadSerializer, StavkeDokumentaWriteSerializer
from .models import Dokument, StavkeDokumenta

class DokumentViewSet(viewsets.ModelViewSet):
    queryset = Dokument.objects.select_related('poslovni_partner', 'zaposleni', 'zaposleni__pozicija', 'skladiste_ulaza', 'skladiste_izlaza', 'transport', 'transport__vozilo', 'transport__vozac')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return DokumentReadSerializer
        return DokumentWriteSerializer 
    

class StavkeDokumentaViewSet(viewsets.ModelViewSet):
    queryset = StavkeDokumenta.objects.select_related('dokument', 'proizvod', 'proizvod__kategorija')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return StavkeDokumentaReadSerializer
        return StavkeDokumentaWriteSerializer 
