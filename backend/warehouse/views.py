from rest_framework import viewsets
from .serializers import SkladisteSerializer, SektorReadSerializer, SektorWriteSerializer, SlotReadSerializer, SlotWriteSerializer
from .models import Skladiste, Sektor, Slot

class SkladisteViewSet(viewsets.ModelViewSet):
    queryset = Skladiste.objects.all()
    serializer_class = SkladisteSerializer


class SektorViewSet(viewsets.ModelViewSet):
    queryset = Sektor.objects.select_related('skladiste')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return SektorReadSerializer
        return SektorWriteSerializer


class SlotViewSet(viewsets.ModelViewSet):
    queryset = Slot.objects.select_related('sektor', 'sektor__skladiste')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return SlotReadSerializer
        return SlotWriteSerializer