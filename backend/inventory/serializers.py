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


class ZaliheWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zalihe
        fields = '__all__'

    def validate(self, data):
        if data.get('rezervisana_kolicina') is not None and data.get('kolicina') is not None:
            if data['rezervisana_kolicina'] > data['kolicina']:
                raise serializers.ValidationError('Rezervisana količina ne sme biti veća od dostupne količine')
            
        return data