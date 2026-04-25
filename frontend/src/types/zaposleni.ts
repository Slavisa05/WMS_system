export interface Pozicija {
    id: number
    naziv: string
}

export interface Zaposleni {
    id: number
    ime: string
    prezime: string
    jmbg: string
    broj_telefona: string
    datum_rodjenja: string
    datum_zaposlenja: string
    ugovor_do: string | null
    pozicija: Pozicija | null
    user: number
}