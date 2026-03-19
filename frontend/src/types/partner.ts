export interface PoslovniPartner {
    id: number
    naziv: string
    pib: string
    email: string
    adresa: string
    telefon: string
    tip: 'D' | 'K'
}