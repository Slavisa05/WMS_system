from rest_framework import serializers
from django.db.models import Sum
from .models import Skladiste, Sektor, Slot


class SkladisteSerializer(serializers.ModelSerializer):
    adresa = serializers.CharField(validators=[])
    telefon = serializers.CharField(validators=[])

    def validate_naziv(self, value):
        queryset = Skladiste.objects.filter(naziv__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Skladiste sa ovim nazivom vec postoji.')

        return value

    def validate_adresa(self, value):
        queryset = Skladiste.objects.filter(adresa__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Skladiste sa ovom adresom vec postoji.')

        return value

    def validate_telefon(self, value):
        queryset = Skladiste.objects.filter(telefon__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Skladiste sa ovim brojem telefona vec postoji.')

        return value

    class Meta:
        model = Skladiste
        fields = '__all__'


class SektorReadSerializer(serializers.ModelSerializer):
    skladiste = SkladisteSerializer()
    
    class Meta:
        model = Sektor
        fields = '__all__'


class SektorWriteSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        naziv = attrs.get('naziv', self.instance.naziv if self.instance else None)
        skladiste = attrs.get('skladiste', self.instance.skladiste if self.instance else None)

        if naziv and skladiste:
            queryset = Sektor.objects.filter(naziv__iexact=naziv, skladiste=skladiste)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError({
                    'non_field_errors': ['Sektor sa ovim nazivom vec postoji u izabranom skladistu.']
                })

        return attrs

    class Meta:
        model = Sektor
        fields = '__all__'
        validators = []


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
    kapacitet = serializers.IntegerField(
        min_value=1,
        error_messages={
            'min_value': 'Kapacitet mora biti veci od 0.'
        }
    )

    def validate(self, attrs):
        naziv = attrs.get('naziv', self.instance.naziv if self.instance else None)
        sektor = attrs.get('sektor', self.instance.sektor if self.instance else None)

        if naziv and sektor:
            queryset = Slot.objects.filter(naziv__iexact=naziv, sektor=sektor)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError({
                    'non_field_errors': ['Slot sa ovim nazivom vec postoji u izabranom sektoru.']
                })

        return attrs

    class Meta:
        model = Slot
        fields = '__all__'
        validators = []
