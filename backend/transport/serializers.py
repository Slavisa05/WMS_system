from rest_framework import serializers
from .models import Vozilo, Transport
from accounts.serializers import ZaposleniReadSerializer

class VoziloReadSerializer(serializers.ModelSerializer):
    zaduzeni_vozac = ZaposleniReadSerializer()

    class Meta:
        model = Vozilo
        fields = '__all__'


class VoziloWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vozilo
        fields = '__all__'


class TransportReadSerializer(serializers.ModelSerializer):
    vozac = ZaposleniReadSerializer()
    vozilo = VoziloReadSerializer()

    class Meta:
        model = Transport
        fields = '__all__'


class TransportWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = '__all__'

    def create(self, validated_data):
        if not validated_data.get('vozac'):
            validated_data['vozac'] = validated_data['vozilo'].zaduzeni_vozac
        return super().create(validated_data)