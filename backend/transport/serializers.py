from rest_framework import serializers
from django.db.models import F, Q
from django.db.models.functions import Coalesce
from .models import Vozilo, Transport
from accounts.serializers import ZaposleniReadSerializer

class VoziloReadSerializer(serializers.ModelSerializer):
    zaduzeni_vozac = ZaposleniReadSerializer()

    class Meta:
        model = Vozilo
        fields = '__all__'


class VoziloWriteSerializer(serializers.ModelSerializer):
    registarski_broj = serializers.CharField(validators=[])

    def validate_registarski_broj(self, value):
        queryset = Vozilo.objects.filter(registarski_broj__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Vozilo sa ovim registarskim brojem vec postoji.')

        return value

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
    def validate(self, attrs):
        vozilo = attrs.get('vozilo', self.instance.vozilo if self.instance else None)
        datum_polaska = attrs.get('datum_polaska', self.instance.datum_polaska if self.instance else None)
        datum_zavrsetka = attrs.get('datum_zavrsetka', self.instance.datum_zavrsetka if self.instance else None)

        # Ako vozac nije prosledjen, koristi se zaduzeni vozac iz vozila.
        vozac = attrs.get('vozac', self.instance.vozac if self.instance else None)
        if vozac is None and vozilo is not None:
            vozac = vozilo.zaduzeni_vozac

        if not vozilo or not datum_polaska:
            return attrs

        new_start = datum_polaska
        new_end = datum_zavrsetka or datum_polaska

        # Preklapanje intervala: start <= new_end i end >= new_start.
        queryset = Transport.objects.annotate(
            effective_end=Coalesce('datum_zavrsetka', F('datum_polaska'))
        ).filter(
            datum_polaska__lte=new_end,
            effective_end__gte=new_start,
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.filter(vozilo=vozilo).exists():
            raise serializers.ValidationError({
                'vozilo': ['Ovo vozilo je vec rasporedjeno u ovom vremenskom periodu.']
            })

        if vozac and queryset.filter(Q(vozac=vozac) | Q(vozac__isnull=True, vozilo__zaduzeni_vozac=vozac)).exists():
            raise serializers.ValidationError({
                'vozac': ['Ovaj vozac je vec rasporedjen u ovom vremenskom periodu.']
            })

        attrs['vozac'] = vozac
        return attrs

    class Meta:
        model = Transport
        fields = '__all__'

    def create(self, validated_data):
        if not validated_data.get('vozac'):
            validated_data['vozac'] = validated_data['vozilo'].zaduzeni_vozac
        return super().create(validated_data)