from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from decimal import Decimal
from django.db.models import F, ExpressionWrapper, DecimalField, Sum, Value, Count
from django.db.models.functions import Coalesce
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from documentss.models import StavkeDokumenta
from warehouse.models import Skladiste, Slot
from inventory.models import Zalihe
from documentss.models import Dokument


class ReportsViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def promet_robe(self, request):
        period = request.query_params.get('period', 'dnevno')

        trunc_fn = {
            'dnevno': TruncDay,
            'nedeljno': TruncWeek,
            'mesecno': TruncMonth,
        }.get(period, TruncDay)

        ulaz_tipovi = ['PRIJEMNICA', 'POVRATNICA_K']
        izlaz_tipovi = ['OTPREMNICA', 'POVRATNICA_D', 'OTPIS']

        ulaz = (
            StavkeDokumenta.objects
            .filter(dokument__status='ODOBREN', dokument__tip__in=ulaz_tipovi)
            .annotate(period=trunc_fn('dokument__datum_vreme'))
            .values('period')
            .annotate(
                ukupno=Coalesce(
                    Sum('kolicina'),
                    Value(Decimal('0.00'), output_field=DecimalField(max_digits=10, decimal_places=2))
                )
            )
            .order_by('period')
        )

        izlaz = (
            StavkeDokumenta.objects
            .filter(dokument__status='ODOBREN', dokument__tip__in=izlaz_tipovi)
            .annotate(period=trunc_fn('dokument__datum_vreme'))
            .values('period')
            .annotate(
                ukupno=Coalesce(
                    Sum('kolicina'),
                    Value(Decimal('0.00'), output_field=DecimalField(max_digits=10, decimal_places=2))
                )
            )
            .order_by('period')
        )

        # Spoji ulaz i izlaz po periodu
        podaci = {}
        for stavka in ulaz:
            period_key = stavka['period'].strftime('%Y-%m-%d')
            podaci.setdefault(period_key, {'period': period_key, 'ulaz': 0, 'izlaz': 0})
            podaci[period_key]['ulaz'] = stavka['ukupno']

        for stavka in izlaz:
            period_key = stavka['period'].strftime('%Y-%m-%d')
            podaci.setdefault(period_key, {'period': period_key, 'ulaz': 0, 'izlaz': 0})
            podaci[period_key]['izlaz'] = stavka['ukupno']

        rezultat = sorted(podaci.values(), key=lambda x: x['period'])
        return Response(rezultat)
    

    # ================================================================================= #
    @action(detail=False, methods=['get'])
    def popunjenost_skladista(self, request):
        skladista = Skladiste.objects.all()
        rezultat = []

        for skladiste in skladista:
            slotovi = Slot.objects.filter(sektor__skladiste=skladiste)
            kapacitet = slotovi.aggregate(ukupno=Sum('kapacitet'))['ukupno'] or 0
            trenutna_kolicina = Zalihe.objects.filter(slot__in=slotovi).aggregate(ukupno=Sum('kolicina'))['ukupno'] or 0
            popunjenost = (trenutna_kolicina / kapacitet) * 100 if kapacitet > 0 else 0

            rezultat.append({
                'naziv': skladiste.naziv,
                'ukupni_kapacitet': kapacitet,
                'trenutna_kolicina': trenutna_kolicina,
                'popunjenost_procenat': round(popunjenost, 2)
            })

        return Response(rezultat)


    @action(detail=False, methods=['get'])
    def top_proizvodi(self, request):
        stavke = StavkeDokumenta.objects.filter(dokument__status='ODOBREN')
        rezultat = stavke.values('proizvod__naziv').annotate(ukupno=Sum('kolicina')).order_by('-ukupno')[:10]
        return Response(rezultat)
    

    @action(detail=False, methods=['get'])
    def dokument_status(self, request):
        dokumenta = Dokument.objects.all()
        rezultat = dokumenta.values('status').annotate(ukupno=Count('id'))
        return Response(rezultat)
    

    @action(detail=False, methods=['get'])
    def dokument_tip(self, request):
        dokumenta = Dokument.objects.all()
        rezultat = dokumenta.values('tip').annotate(ukupno=Count('id'))
        return Response(rezultat)
    

    @action(detail=False, methods=['get'])
    def vrednost_zalihe(self, request):
        rezultat = (
            Zalihe.objects
            .annotate(vrednost=ExpressionWrapper(
                F('kolicina') * F('proizvod__nabavna_cena'),
                output_field=DecimalField()
            ))
            .values('proizvod__kategorija__naziv')
            .annotate(ukupna_vrednost=Sum('vrednost'))
            .order_by('-ukupna_vrednost')
        )
        return Response(rezultat)

    
