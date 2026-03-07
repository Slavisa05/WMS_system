from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from django.utils import timezone
from accounts.models import Zaposleni


class Vozilo(BaseModel):
    model = models.CharField(max_length=50, blank=False, null=False)
    registarski_broj = models.CharField(max_length=15, blank=False, null=False, db_index=True, unique=True)
    datum_registracije = models.DateField(blank=False, null=False)
    poslednji_tehnicki = models.DateField(blank=False, null=False)
    zaduzeni_vozac = models.ForeignKey(Zaposleni, blank=False, null=False, on_delete=models.PROTECT)

    class Meta:
        verbose_name_plural = "Vozila"

    def __str__(self):
        return f'{self.model} - {self.registarski_broj} - {self.zaduzeni_vozac.ime}'
    

class Transport(BaseModel):
    STATUS_CHOICES = [
        ('ZAKAZANO', 'Zakazano'),
        ('U_TOKU', 'U toku'),
        ('ZAVRSENO', 'Završeno'),
        ('OTKAZANO', 'Otkazano'),
        ('NEUSPESNO', 'Neuspešno'),
    ]

    vozac = models.ForeignKey(Zaposleni, blank=True, null=True, on_delete=models.PROTECT)
    vozilo = models.ForeignKey(Vozilo, blank=False, null=False, on_delete=models.PROTECT)
    datum_polaska = models.DateTimeField(blank=False, null=False)
    datum_zavrsetka = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=9, blank=False, null=False, choices=STATUS_CHOICES)
    napomena = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Transporti"

    def clean(self):
        super().clean()

        if self.datum_zavrsetka and self.datum_polaska:
            if self.datum_zavrsetka < self.datum_polaska:
                raise ValidationError('Datum završetka ne može biti pre datuma polaska')
        
        if self.status == 'ZAKAZANO' and self.datum_polaska:
            if self.datum_polaska < timezone.now().date():
                raise ValidationError('Datum polaska ne može biti u prošlosti')
            
        if self.status == 'ZAVRSENO' and not self.datum_zavrsetka:
            raise ValidationError('Završeni transport mora imati datum završetka')

    def __str__(self):
        return f'{self.id} - {self.vozac} - {self.vozilo} - {self.status}'


