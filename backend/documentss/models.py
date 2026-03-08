from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from partners.models import PoslovniPartner
from accounts.models import Zaposleni
from warehouse.models import Skladiste, Slot
from transport.models import Transport
from inventory.models import Proizvod


class Dokument(BaseModel):
    TIP_CHOICES = [
        ('PRIJEMNICA', 'Prijemnica'),
        ('POVRATNICA_K', 'Povratnica od kupca'),
        ('OTPREMNICA', 'Otpremnica'),
        ('POVRATNICA_D', 'Povratnica dobavljaču'),
        ('MEDJUSKLADISNICA', 'Međuskladišnica'),
        ('PRENOS', 'Interni prenos'),
        ('INVENTAR', 'Popis inventara'),
        ('OTPIS', 'Otpisana roba')
    ]

    STATUS_CHOICES = [
        ('NACRT', 'Nacrt',),
        ('NA_CEKANJU', 'Na čekanju'),
        ('ODOBREN', 'Odobren'),
        ('ODBIJEN', 'Odbijen'),
    ]

    tip = models.CharField(max_length=16, blank=False, null=False, choices=TIP_CHOICES)
    datum_vreme = models.DateTimeField()
    poslovni_partner = models.ForeignKey(PoslovniPartner, blank=True, null=True, on_delete=models.PROTECT)
    zaposleni = models.ForeignKey(Zaposleni, blank=False, null=False, on_delete=models.PROTECT)
    skladiste_ulaza = models.ForeignKey(Skladiste, blank=True, null=True, on_delete=models.PROTECT, related_name='dokumenti_ulaza')
    skladiste_izlaza = models.ForeignKey(Skladiste, blank=True, null=True, on_delete=models.PROTECT, related_name='dokumenti_izlaza')
    transport = models.ForeignKey(Transport, blank=True, null=True, on_delete=models.PROTECT)
    status = models.CharField(max_length=15, blank=False, null=False, choices=STATUS_CHOICES, default='NACRT')

    class Meta:
        verbose_name_plural = "Dokumenti"

    def clean(self):
        super().clean()

        ZAHTEVA_PARTNERA = ['PRIJEMNICA', 'POVRATNICA_K', 'OTPREMNICA', 'POVRATNICA_D']
        ZAHTEVA_ULAZ = ['PRIJEMNICA', 'POVRATNICA_K', 'MEDJUSKLADISNICA', 'PRENOS']
        ZAHTEVA_IZLAZ = ['OTPREMNICA', 'POVRATNICA_D', 'MEDJUSKLADISNICA', 'PRENOS']

        if self.tip in ZAHTEVA_PARTNERA and not self.poslovni_partner:
            raise ValidationError('Ovaj tip dokumenta zahteva poslovnog partnera')
        
        if self.tip in ZAHTEVA_ULAZ and not self.skladiste_ulaza:
            raise ValidationError('Ovaj tip dokumenta zahteva skladište ulaza')
        
        if self.tip in ZAHTEVA_IZLAZ and not self.skladiste_izlaza:
            raise ValidationError('Ovaj tip dokumenta zahteva skladište izlaza')
        
        if self.skladiste_ulaza and self.skladiste_izlaza:
            if self.skladiste_ulaza == self.skladiste_izlaza:
                raise ValidationError('Skladište ulaza i izlaza ne mogu biti isti')

    
    def __str__(self):
        return f'{self.tip} - {self.datum_vreme}'


class StavkeDokumenta(BaseModel):
    dokument = models.ForeignKey(Dokument, blank=False, null=False, on_delete=models.CASCADE, related_name='stavke')
    proizvod = models.ForeignKey(Proizvod, blank=False, null=False, on_delete=models.PROTECT)
    slot_ulaza = models.ForeignKey(Slot, blank=False, null=False, on_delete=models.PROTECT, related_name='stavke_ulaza')
    slot_izlaza = models.ForeignKey(Slot, blank=False, null=False, on_delete=models.PROTECT, related_name='stavke_izlaza')
    kolicina = models.DecimalField(max_digits=10, decimal_places=2)
    cena = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name_plural = "Stavke Dokumenta"
        unique_together = ('dokument', 'proizvod')

    def clean(self):
        super().clean()

        if self.kolicina <= 0:
            raise ValidationError('Količina ne može biti manja ili jednaka 0')
        
        if self.cena <= 0:
            raise ValidationError('Cena ne može biti manja ili jednaka 0')
        
    def __str__(self):
        return f'{self.dokument} - {self.proizvod.naziv} - {self.kolicina}KOM - {self.cena}RSD'