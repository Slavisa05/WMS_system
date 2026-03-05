from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel


class PoslovniPartner(BaseModel):
    TIP_CHOICES = [
        ('D', 'Dobavljač'),
        ('K', 'Kupac'),
    ]

    naziv = models.CharField(max_length=50, blank=False, null=False, db_index=True)
    pib = models.CharField(max_length=9, blank=False, null=False, unique=True)
    email = models.EmailField(blank=False, null=False, unique=True)
    adresa = models.CharField(max_length=50, blank=False, null=False)
    telefon = models.CharField(max_length=20, blank=False, null=False)
    tip = models.CharField(max_length=1, blank=False, null=False, choices=TIP_CHOICES)

    class Meta:
        verbose_name_plural = "Poslovni Partneri"

    def clean(self):
        super().clean()

        if len(self.pib) != 9:
            raise ValidationError('PIB mora imati 9 cifara')
        
    def __str__(self):
        return f'{self.naziv} - {self.pib}'

