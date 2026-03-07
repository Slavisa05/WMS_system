from rest_framework import viewsets
from .serializers import PoslovniPartnerSerializer
from .models import PoslovniPartner

class PoslovniPartnerViewSet(viewsets.ModelViewSet):
    queryset = PoslovniPartner.objects.all()
    serializer_class = PoslovniPartnerSerializer