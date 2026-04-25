from rest_framework import serializers
from .models import Pozicija, Zaposleni
from django.contrib.auth.models import User


class PozicijaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pozicija
        fields = '__all__'


class ZaposleniReadSerializer(serializers.ModelSerializer):
    pozicija = PozicijaSerializer()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Zaposleni
        fields = '__all__'

    def get_username(self, obj):
        return obj.user.username


class ZaposleniWriteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    jmbg = serializers.CharField(validators=[])
    broj_telefona = serializers.CharField(validators=[])
    datum_rodjenja = serializers.DateField(input_formats=['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y'])
    datum_zaposlenja = serializers.DateField(input_formats=['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y'])
    ugovor_do = serializers.DateField(input_formats=['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y'], required=False, allow_null=True)

    class Meta:
        model = Zaposleni
        exclude = ['user']


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        if self.instance:  
            self.fields['username'].required = False
            self.fields['password1'].required = False
            self.fields['password2'].required = False

    def validate(self, data):
        if data.get('password1') or data.get('password2'):
            if data.get('password1') != data.get('password2'):
                raise serializers.ValidationError('Lozinke se ne poklapaju')

        datum_zaposlenja = data.get('datum_zaposlenja', self.instance.datum_zaposlenja if self.instance else None)
        ugovor_do = data.get('ugovor_do', self.instance.ugovor_do if self.instance else None)
        if ugovor_do and datum_zaposlenja and ugovor_do <= datum_zaposlenja:
            raise serializers.ValidationError('Datum ugovora ne može biti pre datuma zaposlenja')
        
        return data

    def validate_jmbg(self, value):
        queryset = Zaposleni.objects.filter(jmbg=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Zaposleni sa ovim JMBG-om vec postoji.')

        return value

    def validate_broj_telefona(self, value):
        queryset = Zaposleni.objects.filter(broj_telefona=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError('Zaposleni sa ovim brojem telefona vec postoji.')

        return value

    def validate_username(self, value):
        queryset = User.objects.filter(username__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.user_id)

        if queryset.exists():
            raise serializers.ValidationError('Korisnik sa tim korisnickim imenom vec postoji.')

        return value

    def create(self, validated_data):
        username_object = validated_data.pop('username')
        password1_object = validated_data.pop('password1')
        validated_data.pop('password2')

        user = User.objects.create_user(username=username_object, password=password1_object)

        zaposlen = Zaposleni.objects.create(user = user, **validated_data)
        return zaposlen
    
    def update(self, instance, validated_data):
        username = validated_data.pop('username', None)
        password1 = validated_data.pop('password1', None)
        validated_data.pop('password2', None)

        if username:
            instance.user.username = username
            instance.user.save()
        
        if password1:
            instance.user.set_password(password1)
            instance.user.save()

        return super().update(instance, validated_data)