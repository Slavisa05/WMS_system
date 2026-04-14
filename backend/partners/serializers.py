from rest_framework import serializers
from .models import PoslovniPartner


class PoslovniPartnerSerializer(serializers.ModelSerializer):
    naziv = serializers.CharField(validators=[])
    pib = serializers.CharField(validators=[])
    email = serializers.EmailField(validators=[])
    telefon = serializers.CharField(validators=[])
    adresa = serializers.CharField(validators=[])

    def validate_naziv(self, value):
        queryset = PoslovniPartner.objects.filter(naziv__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Poslovni partner sa ovim imenom vec postoji.')

        return value

    def validate_pib(self, value):
        queryset = PoslovniPartner.objects.filter(pib__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Poslovni partner sa ovim PIB-om vec postoji.')

        return value

    def validate_email(self, value):
        queryset = PoslovniPartner.objects.filter(email__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Poslovni partner sa ovim email-om vec postoji.')

        return value

    def validate_telefon(self, value):
        queryset = PoslovniPartner.objects.filter(telefon__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Poslovni partner sa ovim brojem telefona vec postoji.')

        return value

    def validate_adresa(self, value):
        queryset = PoslovniPartner.objects.filter(adresa__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Poslovni partner sa ovom adresom vec postoji.')

        return value

    class Meta:
        model = PoslovniPartner
        fields = '__all__'

