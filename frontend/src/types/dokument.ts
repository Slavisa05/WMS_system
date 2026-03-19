import type { PoslovniPartner } from './partner'
import type { Zaposleni } from './zaposleni'
import type { Skladiste, Slot } from './skladiste'
import type { Transport } from './transport'
import type { Proizvod } from './inventar'

export interface StavkaDokumenta {
    id: number
    proizvod: Proizvod
    slot_ulaza: Slot
    slot_izlaza: Slot
    kolicina: number
    cena: number
}

export interface Dokument {
    id: number
    tip: 'PRIJEMNICA' | 'POVRATNICA_K' | 'OTPREMNICA' | 'POVRATNICA_D' | 'MEDJUSKLADISNICA' | 'PRENOS' | 'INVENTAR' | 'OTPIS'
    datum_vreme: string
    poslovni_partner: PoslovniPartner | null
    zaposleni: Zaposleni
    skladiste_ulaza: Skladiste | null
    skladiste_izlaza: Skladiste | null
    transport: Transport | null
    status: 'NACRT' | 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN'
    stavke: StavkaDokumenta[]
}