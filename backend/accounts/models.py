from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from django.contrib.auth.models import User

class Pozicija(BaseModel):
    naziv = models.CharField(max_length=50, null=False, blank=False)

    class Meta:
        verbose_name_plural = "Pozicije"

    def __str__(self):
        return self.naziv
    

class Zaposleni(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ime = models.CharField(max_length=25, null=False, blank=False, db_index=True)
    prezime = models.CharField(max_length=25, null=False, blank=False)
    jmbg = models.CharField(max_length=13, null=False, blank=False, unique=True)
    broj_telefona = models.CharField(max_length=20, null=False, blank=False, unique=True)
    datum_zaposlenja = models.DateField(blank=False, null=False)
    ugovor_do = models.DateField(null=True, blank=True)
    pozicija = models.ForeignKey(Pozicija, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name_plural = "Zaposleni"
        ordering = ['prezime', 'ime']


    def clean(self):
        super().clean()
        
        if self.ugovor_do and self.ugovor_do <= self.datum_zaposlenja:
            raise ValidationError('Datum ugovora ne može biti pre datuma zaposlenja')



    def __str__(self):
        return f"{self.ime} - {self.prezime} - {self.jmbg}"