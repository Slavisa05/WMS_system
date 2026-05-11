from rest_framework import serializers
from django.utils import timezone
from .models import Dokument, StavkeDokumenta
from partners.serializers import PoslovniPartnerSerializer
from accounts.serializers import ZaposleniReadSerializer
from warehouse.serializers import SkladisteSerializer
from transport.serializers import TransportReadSerializer
from inventory.serializers import ProizvodReadSerializer

class StavkeDokumentaReadSerializer(serializers.ModelSerializer):
    dokument = serializers.PrimaryKeyRelatedField(read_only=True)
    proizvod = ProizvodReadSerializer()

    class Meta:
        model = StavkeDokumenta
        fields = '__all__'


class StavkeDokumentaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StavkeDokumenta
        fields = '__all__'

    def validate(self, data):
        if data.get('kolicina') <= 0:
            raise serializers.ValidationError('Količina ne može biti manja ili jednaka 0')
        
        if data.get('cena') <= 0:
            raise serializers.ValidationError('Cena ne može biti manja ili jednaka 0')
        
        return data


class StavkeDokumentaNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StavkeDokumenta
        exclude = ['dokument']

    def validate(self, data):
        if data.get('kolicina') <= 0:
            raise serializers.ValidationError('Količina ne može biti manja ili jednaka 0')
        
        if data.get('cena') <= 0:
            raise serializers.ValidationError('Cena ne može biti manja ili jednaka 0')
        
        return data

class DokumentReadSerializer(serializers.ModelSerializer):
    poslovni_partner = PoslovniPartnerSerializer()
    zaposleni = ZaposleniReadSerializer()
    skladiste_ulaza = SkladisteSerializer()
    skladiste_izlaza = SkladisteSerializer()
    transport = TransportReadSerializer()
    stavke = StavkeDokumentaReadSerializer(many=True, read_only=True)
    odobrio = ZaposleniReadSerializer(read_only=True)

    class Meta:
        model = Dokument
        fields = '__all__'


class DokumentWriteSerializer(serializers.ModelSerializer):
    stavke = StavkeDokumentaNestedSerializer(many=True)
    odobrio = serializers.PrimaryKeyRelatedField(read_only=True)      # ← dodaj
    datum_odluke = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Dokument
        fields = '__all__'

    def validate(self, data):
        ZAHTEVA_PARTNERA = ['PRIJEMNICA', 'POVRATNICA_K', 'OTPREMNICA', 'POVRATNICA_D']
        ZAHTEVA_ULAZ = ['PRIJEMNICA', 'POVRATNICA_K', 'MEDJUSKLADISNICA', 'PRENOS']
        ZAHTEVA_IZLAZ = ['OTPREMNICA', 'POVRATNICA_D', 'MEDJUSKLADISNICA', 'PRENOS']
        ZATVORENI_STATUSI_TRANSPORTA = ['ZAVRSENO', 'OTKAZANO', 'NEUSPESNO']

        tip = data.get('tip', self.instance.tip if self.instance else None)
        transport = data.get('transport', self.instance.transport if self.instance else None)
        datum_vreme = data.get('datum_vreme', self.instance.datum_vreme if self.instance else None)

        if tip in ZAHTEVA_PARTNERA and not data.get('poslovni_partner'):
            raise serializers.ValidationError('Ovaj tip dokumenta zahteva poslovnog partnera')
        
        if tip in ZAHTEVA_ULAZ and not data.get('skladiste_ulaza'):
            raise serializers.ValidationError('Ovaj tip dokumenta zahteva skladište ulaza')
        
        if tip in ZAHTEVA_IZLAZ and not data.get('skladiste_izlaza'):
            raise serializers.ValidationError('Ovaj tip dokumenta zahteva skladište izlaza')
        
        if data.get('skladiste_ulaza') and data.get('skladiste_izlaza'):
            if data['skladiste_ulaza'] == data['skladiste_izlaza']:
                raise serializers.ValidationError('Skladište ulaza i izlaza ne mogu biti isti')

        if transport:
            if transport.datum_polaska < timezone.now():
                raise serializers.ValidationError('Ne možete povezati dokument sa transportom kojem je datum polaska prošao.')

            if transport.status in ZATVORENI_STATUSI_TRANSPORTA:
                raise serializers.ValidationError('Ne možete povezati dokument sa transportom koji je već završen, otkazan ili neuspešan.')

            if datum_vreme and datum_vreme > transport.datum_polaska:
                raise serializers.ValidationError('Datum i vreme dokumenta ne mogu biti posle datuma polaska transporta.')
        
        return data

    def create(self, validated_data):
        stavke_data = validated_data.pop('stavke', [])
        dokument = Dokument.objects.create(**validated_data)
        for stavka_data in stavke_data:
            StavkeDokumenta.objects.create(dokument=dokument, **stavka_data)
        return dokument
    
    def update(self, instance, validated_data):
        stavke_data = validated_data.pop('stavke', None)

        if instance.status != 'NACRT':
            raise serializers.ValidationError('Ne možete menjati dokument koji nije nacrt.')
        
        instance = super().update(instance, validated_data)

        if stavke_data is not None:
            instance.stavke.all().delete()
            for stavka_data in stavke_data:
                StavkeDokumenta.objects.create(dokument=instance, **stavka_data)

        return instance
