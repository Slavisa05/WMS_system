from django.db import models
from core.models import BaseModel


class Skladiste(BaseModel):
    TIP_CHOICES = [
        ('DIST', 'Distributivni centar'),
        ('VELE', 'Veleprodajno skladište'),
        ('MALO', 'Maloprodajni magacin'),
        ('TRAN', 'Tranzit'),
    ]

    naziv = models.CharField(max_length=50, blank=False, null=False, db_index=True)
    adresa = models.CharField(max_length=50, blank=False, null=False, unique=True)
    telefon = models.CharField(max_length=20, blank=False, null=False, unique=True)
    tip = models.CharField(max_length=4, choices=TIP_CHOICES, blank=False, null=False)

    class Meta:
        verbose_name_plural = "Skladišta"

    def __str__(self):
        return f'{self.naziv} - {self.adresa} - {self.telefon}'


class Sektor(BaseModel):
    naziv = models.CharField(max_length=50, blank=False, null=False)
    skladiste = models.ForeignKey(Skladiste, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Sektori"
        unique_together = ('naziv', 'skladiste')

    def __str__(self):
        return self.naziv
    

class Slot(BaseModel):
    naziv = models.CharField(max_length=50, blank=False, null=False)
    sektor = models.ForeignKey(Sektor, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Slotovi"
        unique_together = ('naziv', 'sektor')

    def __str__(self):
        return self.naziv