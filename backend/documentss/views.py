from rest_framework import viewsets
from .serializers import DokumentReadSerializer, DokumentWriteSerializer, StavkeDokumentaReadSerializer, StavkeDokumentaWriteSerializer
from .models import Dokument, StavkeDokumenta
from core.mixins import SoftDeleteMixin
from core.permissions import IsZaposlen


class DokumentViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Dokument.objects.filter(is_active=True).select_related('poslovni_partner', 'zaposleni', 'zaposleni__pozicija', 'skladiste_ulaza', 'skladiste_izlaza', 'transport', 'transport__vozilo', 'transport__vozac')
    filterset_fields = ['tip', 'status', 'poslovni_partner', 'zaposleni', 'skladiste_ulaza', 'skladiste_izlaza']

    def get_permissions(self):
        return [IsZaposlen()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return DokumentReadSerializer
        return DokumentWriteSerializer 
    

class StavkeDokumentaViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = StavkeDokumenta.objects.filter(is_active=True).select_related('dokument', 'proizvod', 'proizvod__kategorija')
    filterset_fields = ['dokument', 'proizvod']

    def get_permissions(self):
            return [IsZaposlen()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return StavkeDokumentaReadSerializer
        return StavkeDokumentaWriteSerializer 
