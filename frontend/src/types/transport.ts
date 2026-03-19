import type { Zaposleni } from './zaposleni'

export interface Vozilo {
    id: number
    model: string
    registarski_broj: string
    datum_registracije: string
    poslednji_tehnicki: string
    zaduzeni_vozac: Zaposleni
}

export interface Transport {
    id: number
    vozac: Zaposleni | null
    vozilo: Vozilo
    datum_polaska: string
    datum_zavrsetka: string | null
    status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO'
    napomena: string | null
}