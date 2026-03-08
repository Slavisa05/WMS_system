from rest_framework import viewsets
from .serializers import PoslovniPartnerSerializer
from .models import PoslovniPartner
from core.mixins import SoftDeleteMixin
from core.permissions import IsMenadzer, IsZaposlen
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class PoslovniPartnerViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    queryset = PoslovniPartner.objects.filter(is_active=True)
    serializer_class = PoslovniPartnerSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['tip']
    search_fields = ['naziv', 'pib']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsZaposlen()]
        return [IsMenadzer()]