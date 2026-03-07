from rest_framework import serializers
from .models import Dokument, StavkeDokumenta
from partners.serializers import PoslovniPartnerSerializer
from accounts.serializers import ZaposleniReadSerializer
from warehouse.serializers import SkladisteSerializer
from transport.serializers import TransportReadSerializer
from inventory.serializers import ProizvodReadSerializer


class DokumentReadSerializer(serializers.ModelSerializer):
    poslovni_partner = PoslovniPartnerSerializer()
    zaposleni = ZaposleniReadSerializer()
    skladiste_ulaza = SkladisteSerializer()
    skladiste_izlaza = SkladisteSerializer()
    transport = TransportReadSerializer()

    class Meta:
        model = Dokument
        fields = '__all__'


class DokumentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dokument
        fields = '__all__'

    def validate(self, data):
        ZAHTEVA_PARTNERA = ['PRIJEMNICA', 'POVRATNICA_K', 'OTPREMNICA', 'POVRATNICA_D']
        ZAHTEVA_ULAZ = ['PRIJEMNICA', 'POVRATNICA_K', 'MEDJUSKLADISNICA', 'PRENOS']
        ZAHTEVA_IZLAZ = ['OTPREMNICA', 'POVRATNICA_D', 'MEDJUSKLADISNICA', 'PRENOS']

        tip = data.get('tip')

        if tip in ZAHTEVA_PARTNERA and not data.get('poslovni_partner'):
            raise serializers.ValidationError('Ovaj tip dokumenta zahteva poslovnog partnera')
        
        if tip in ZAHTEVA_ULAZ and not data.get('skladiste_ulaza'):
            raise serializers.ValidationError('Ovaj tip dokumenta zahteva skladište ulaza')
        
        if tip in ZAHTEVA_IZLAZ and not data.get('skladiste_izlaza'):
            raise serializers.ValidationError('Ovaj tip dokumenta zahteva skladište izlaza')
        
        if data.get('skladiste_ulaza') and data.get('skladiste_izlaza'):
            if data['skladiste_ulaza'] == data['skladiste_izlaza']:
                raise serializers.ValidationError('Skladište ulaza i izlaza ne mogu biti isti')
        
        return data


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