export interface Skladiste {
    id: number
    naziv: string
    adresa: string
    telefon: string
    tip: 'DIST' | 'VELE' | 'MALO' | 'TRAN'
}

export interface Sektor {
    id: number
    naziv: string
    skladiste: Skladiste
}

export interface Slot {
    id: number
    naziv: string
    kapacitet: number
    sektor: Sektor
    zauzet_kapacitet: number
    slobodan_kapacitet: number
}