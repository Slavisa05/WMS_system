from inventory.models import Zalihe


def povecaj_zalihe(dokument):
    stavke = dokument.stavke.all()

    for stavka in stavke:
        zalihe, created = Zalihe.objects.get_or_create(
            proizvod=stavka.proizvod,
            slot=stavka.slot_ulaza, 
            defaults={'kolicina': 0, 'rezervisana_kolicina': 0}
        )

        zalihe.kolicina += stavka.kolicina
        zalihe.save()


def smanji_zalihe(dokument):
    stavke = dokument.stavke.all()

    for stavka in stavke:
        try:
            zalihe = Zalihe.objects.get(
                proizvod=stavka.proizvod,
                slot=stavka.slot_izlaza
            )
        except Zalihe.DoesNotExist:
            raise Exception(f'Nema zaliha za proizvod {stavka.proizvod.naziv} na slotu {stavka.slot}')
        
        dostupna_kolicina = zalihe.kolicina - zalihe.rezervisana_kolicina
        if dostupna_kolicina < stavka.kolicina:
            raise Exception(f'Nedovoljno zaliha za proizvod {stavka.proizvod.naziv}')
        
        zalihe.kolicina -= stavka.kolicina
        zalihe.save()


def obradi_medjuskladisnicu(dokument):
    stavke = dokument.stavke.all()

    for stavka in stavke:
        try:
            zalihe_izlaz = Zalihe.objects.get(
                proizvod=stavka.proizvod,
                slot=stavka.slot_izlaza
            )
        except Zalihe.DoesNotExist:
            raise Exception(f'Nema zaliha za proizvod {stavka.proizvod.naziv} na slotu {stavka.slot_izlaza}')
        
        dostupna_kolicina = zalihe_izlaz.kolicina - zalihe_izlaz.rezervisana_kolicina
        if dostupna_kolicina < stavka.kolicina:
            raise Exception(f'Nedovoljno zaliha za proizvod {stavka.proizvod.naziv}')
        
        
        zalihe_izlaz.kolicina -= stavka.kolicina
        zalihe_izlaz.save()

        zalihe_ulaz, created = Zalihe.objects.get_or_create(
            proizvod=stavka.proizvod,
            slot=stavka.slot_ulaza,
            defaults={'kolicina': 0, 'rezervisana_kolicina': 0}
        )
        zalihe_ulaz.kolicina += stavka.kolicina
        zalihe_ulaz.save()


def koriguj_zalihe(dokument):
    stavke = dokument.stavke.all()

    for stavka in stavke:
        zalihe, created = Zalihe.objects.get_or_create(
            proizvod=stavka.proizvod,
            slot=stavka.slot_ulaza,
            defaults={'kolicina': 0, 'rezervisana_kolicina': 0}
        )
        zalihe.kolicina = stavka.kolicina
        zalihe.save()


def prenesi_zalihe(dokument):
    stavke = dokument.stavke.all()

    for stavka in stavke:
        if stavka.slot_ulaza.sektor.skladiste != stavka.slot_izlaza.sektor.skladiste:
            raise Exception(f'Interni prenos mora biti unutar istog skladišta')

        try:
            zalihe_izlaz = Zalihe.objects.get(
                proizvod=stavka.proizvod,
                slot=stavka.slot_izlaza
            )
        except Zalihe.DoesNotExist:
            raise Exception(f'Nema zaliha za proizvod {stavka.proizvod.naziv} na slotu {stavka.slot_izlaza}')
        
        dostupna_kolicina = zalihe_izlaz.kolicina - zalihe_izlaz.rezervisana_kolicina
        if dostupna_kolicina < stavka.kolicina:
            raise Exception(f'Nedovoljno zaliha za proizvod {stavka.proizvod.naziv}')
        
        
        zalihe_izlaz.kolicina -= stavka.kolicina
        zalihe_izlaz.save()

        zalihe_ulaz, created = Zalihe.objects.get_or_create(
            proizvod=stavka.proizvod,
            slot=stavka.slot_ulaza,
            defaults={'kolicina': 0, 'rezervisana_kolicina': 0}
        )
        zalihe_ulaz.kolicina += stavka.kolicina
        zalihe_ulaz.save()



def obradi_dokument(dokument):
    match dokument.tip:
        case 'PRIJEMNICA':
            povecaj_zalihe(dokument)
        case 'OTPREMNICA':
            smanji_zalihe(dokument)
        case 'POVRATNICA_K':
            povecaj_zalihe(dokument)
        case 'POVRATNICA_D':
            smanji_zalihe(dokument)
        case 'MEDJUSKLADISNICA':
            obradi_medjuskladisnicu(dokument)
        case 'OTPIS':
            smanji_zalihe(dokument)
        case 'INVENTAR':
            koriguj_zalihe(dokument)
        case 'PRENOS':
            prenesi_zalihe(dokument)