from rest_framework import serializers
from .models import PoslovniPartner

class PoslovniPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoslovniPartner
        fields = '__all__'
