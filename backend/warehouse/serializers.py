from rest_framework import serializers
from django.db.models import Sum
from .models import Skladiste, Sektor, Slot


class SkladisteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skladiste
        fields = '__all__'


class SektorReadSerializer(serializers.ModelSerializer):
    skladiste = SkladisteSerializer()
    
    class Meta:
        model = Sektor
        fields = '__all__'


class SektorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sektor
        fields = '__all__'


class SlotReadSerializer(serializers.ModelSerializer):
    sektor = SektorReadSerializer()
    zauzet_kapacitet = serializers.SerializerMethodField()
    slobodan_kapacitet = serializers.SerializerMethodField()

    def get_zauzet_kapacitet(self, obj):
        return obj.zalihe_set.aggregate(
            total=Sum('kolicina')
        )['total'] or 0

    def get_slobodan_kapacitet(self, obj):
        return obj.kapacitet - self.get_zauzet_kapacitet(obj)

    class Meta:
        model = Slot
        fields = ['id', 'naziv', 'kapacitet', 'sektor', 'zauzet_kapacitet', 'slobodan_kapacitet']
        

class SlotWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'
