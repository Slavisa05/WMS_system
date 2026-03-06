from rest_framework import serializers
from .models import Pozicija, Zaposleni

class PozicijaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pozicija
        fields = '__all__'


class ZaposleniReadSerializer(serializers.ModelSerializer):
    pozicija = PozicijaSerializer()

    class Meta:
        model = Zaposleni
        fields = '__all__'
