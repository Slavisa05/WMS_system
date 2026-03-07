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
        
        if data.get('username'):
            if User.objects.filter(username=data['username']).exists():
                raise serializers.ValidationError('Korisnik sa tim username-om već postoji')
        
        if data.get('ugovor_do') and data['ugovor_do'] <= data['datum_zaposlenja']:
            raise serializers.ValidationError('Datum ugovora ne može biti pre datuma zaposlenja')
        
        return data

    def create(self, validated_data):
        username_object = validated_data.pop('username')
        password1_object = validated_data.pop('password1')
        password2_object = validated_data.pop('password2')

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