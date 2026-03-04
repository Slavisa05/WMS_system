from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from warehouse.models import Slot


class Kategorija(BaseModel):
    naziv = models.CharField(max_length=50, blank=False, null=False, unique=True)

    class Meta:
        verbose_name_plural = "Kategorije"

    def __str__(self):
        return self.naziv
    

class Proizvod(BaseModel):
    JEDINICE_MERE = [
        ('g', 'gram'),
        ('kg', 'kilogram'),
        ('t', 'tona'),
        ('ml', 'mililitar'),
        ('l', 'litar'),
        ('kol', 'količina'),
    ]

    naziv = models.CharField(max_length=50, blank=False, null=False, unique=True)
    barkod = models.CharField(max_length=32, blank=False, null=False, unique=True)
    sifra = models.CharField(max_length=50, blank=False, null=False, unique=True, db_index=True)
    jedinica_mere = models.CharField(max_length=3, choices=JEDINICE_MERE, blank=False, null=False)
    kategorija = models.ForeignKey(Kategorija, on_delete=models.PROTECT)

    class Meta:
        verbose_name_plural = "Proizvodi"

    def clean(self):
        super().clean()

        if len(self.barkod) < 8:
            raise ValidationError('Barkod ne može imati manje od 8 oznaka')
        
    def __str__(self):
        return f'{self.naziv} - {self.barkod} - {self.sifra} - {self.jedinica_mere}'
    

class Zalihe(BaseModel):
    kolicina = models.DecimalField(blank=False, null=False)
    rezervisana_kolicina = models.DecimalField(blank=False, null=False)
    proizvod = models.ForeignKey(Proizvod, blank=False, null=False, on_delete=models.PROTECT)
    slot = models.ForeignKey(Slot, blank=False, null=False, on_delete=models.PROTECT)

    class Meta:
        unique_together = ('proizvod', 'slot')

    def clean(self):
        super().clean()

        if self.kolicina < 0:
            raise ValidationError('Količina ne može biti negativna')
        
        if self.rezervisana_kolicina < 0:
            raise ValidationError('Rezervisana količina ne može biti negativna')
        
        if self.rezervisana_kolicina > self.kolicina:
            raise ValidationError('Ne možete rezervisati veću količinu od one koje trenutno imate')
        
    def __str__(self):
        return f'{self.proizvod.naziv} - {self.slot} - {self.kolicina} - {self.rezervisana_kolicina}'
