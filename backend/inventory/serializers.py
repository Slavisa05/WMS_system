from rest_framework import serializers
from django.db.models import Sum
from .models import Kategorija, Proizvod, Zalihe
from warehouse.serializers import SlotReadSerializer


class KategorijaSerializer(serializers.ModelSerializer):
    broj_proizvoda_ukupno = serializers.SerializerMethodField()

    def get_broj_proizvoda_ukupno(self, obj):
        return obj.proizvod_set.count()

    class Meta:
        model = Kategorija
        fields = ['id', 'naziv', 'broj_proizvoda_ukupno']


class ProizvodReadSerializer(serializers.ModelSerializer):
    kategorija = KategorijaSerializer()
    ukupna_kolicina = serializers.SerializerMethodField()
    rezervisana_kolicina = serializers.SerializerMethodField()
    dostupna_kolicina = serializers.SerializerMethodField()

    def get_ukupna_kolicina(self, obj):
        return obj.zalihe_set.aggregate(
            total=Sum('kolicina')
        )['total'] or 0

    def get_rezervisana_kolicina(self, obj):
        return obj.zalihe_set.aggregate(
            total=Sum('rezervisana_kolicina')
        )['total'] or 0

    def get_dostupna_kolicina(self, obj):
        return self.get_ukupna_kolicina(obj) - self.get_rezervisana_kolicina(obj)

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
    dostupna_kolicina = serializers.SerializerMethodField()

    def get_dostupna_kolicina(self, obj):
        return obj.kolicina - obj.rezervisana_kolicina

    class Meta:
        model = Zalihe
        fields = '__all__'


class ZaliheWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zalihe
        fields = '__all__'