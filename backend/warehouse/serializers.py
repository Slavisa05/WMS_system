from rest_framework import serializers
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

    class Meta:
        model = Slot
        fields = '__all__'


class SlotWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = '__all__'
