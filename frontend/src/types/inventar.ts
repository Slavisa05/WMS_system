import type { Slot } from "./skladiste"

export interface Kategorija {
    id: number
    naziv: string
    broj_proizvoda_ukupno: number
}

export interface Proizvod {
    id: number
    naziv: string
    barkod: string
    sifra: string
    jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol'
    kategorija: Kategorija
    ukupna_kolicina: number
    rezervisana_kolicina_ukupno: number
    dostupna_kolicina: number
}

export interface Zalihe {
    id: number
    kolicina: number
    rezervisana_kolicina: number
    dostupna_kolicina: number
    proizvod: Proizvod
    slot: Slot  
}