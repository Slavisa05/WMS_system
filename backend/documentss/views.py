from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .services import obradi_dokument, rezervisi_zalihe, oslobodi_zalihe
from .serializers import DokumentReadSerializer, DokumentWriteSerializer, StavkeDokumentaReadSerializer, StavkeDokumentaWriteSerializer
from .models import Dokument, StavkeDokumenta
from core.mixins import SoftDeleteMixin
from core.permissions import IsZaposlen, IsMenadzer


class DokumentViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = Dokument.objects.filter(is_active=True).select_related('poslovni_partner', 'zaposleni', 'zaposleni__pozicija', 'skladiste_ulaza', 'skladiste_izlaza', 'transport', 'transport__vozilo', 'transport__vozac').order_by('-created_at')
    filterset_fields = ['tip', 'status', 'poslovni_partner', 'zaposleni', 'skladiste_ulaza', 'skladiste_izlaza']

    def get_permissions(self):
        if self.action in ['odobri', 'odbij']:
            return [IsMenadzer()]
        return [IsZaposlen()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return DokumentReadSerializer
        return DokumentWriteSerializer 
    
    @action(detail=True, methods=['post'])
    def posalji(self, request, pk=None):
        dokument = self.get_object()

        if dokument.status != 'NACRT':
            return Response(
                {'error': 'Samo dokumenti sa statusom NACRT mogu biti poslati na čekanje'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            rezervisi_zalihe(dokument)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        dokument.status = 'NA_CEKANJU'
        dokument.save()

        return Response({'success': 'Dokument je uspješno poslat na čekanje'}, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=['post'])
    def odobri(self, request, pk=None):
        dokument = self.get_object()

        if dokument.status != 'NA_CEKANJU':
            return Response(
                {'error': 'Samo dokumenti sa statusom NA CEKANJU moze da se obradi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            oslobodi_zalihe(dokument)
            obradi_dokument(dokument)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        dokument.status = 'ODOBREN'
        dokument.odobrio = request.user.zaposleni   
        dokument.datum_odluke = timezone.now()
        dokument.save()
        
        return Response({'success': 'Dokument je uspešno odobren'}, status=status.HTTP_200_OK)


    @action(detail=True, methods=['post'])
    def odbij(self, request, pk=None):
        dokument = self.get_object()

        if dokument.status != 'NA_CEKANJU':
            return Response(
                {'error': 'Samo dokumenti sa statusom NA CEKANJU moze da se obradi'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            oslobodi_zalihe(dokument)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        dokument.status = 'ODBIJEN'
        dokument.odobrio = request.user.zaposleni   
        dokument.datum_odluke = timezone.now()
        dokument.save()
        
        return Response({'success': 'Dokument je uspešno odbijen'}, status=status.HTTP_200_OK)
    

class StavkeDokumentaViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = StavkeDokumenta.objects.filter(is_active=True).select_related('dokument', 'proizvod', 'proizvod__kategorija')
    filterset_fields = ['dokument', 'proizvod']

    def get_permissions(self):
            return [IsZaposlen()]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return StavkeDokumentaReadSerializer
        return StavkeDokumentaWriteSerializer 
