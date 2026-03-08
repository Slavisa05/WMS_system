from rest_framework import serializers
from .models import Kategorija, Proizvod, Zalihe
from warehouse.serializers import SlotReadSerializer

class KategorijaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategorija
        fields = '__all__'


class ProizvodReadSerializer(serializers.ModelSerializer):
    kategorija = KategorijaSerializer()

    class Meta:
        model = Proizvod
        fields = '__all__'


class ProizvodWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proizvod
        fields = '__all__'


class ZaliheReadSerializer(serializers.ModelSerializer):
    proizvod = ProizvodReadSerializer()
    slot = SlotReadSerializer()

    class Meta:
        model = Zalihe
        fields = '__all__'
