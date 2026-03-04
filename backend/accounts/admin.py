from django.contrib import admin
from .models import Zaposleni, Pozicija

admin.site.register(Pozicija)
admin.site.register(Zaposleni)