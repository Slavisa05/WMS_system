import api from "./axios";
import type { Dokument } from "@/types/dokument";

type TipDokumenta = 'PRIJEMNICA' | 'POVRATNICA_K' | 'OTPREMNICA' | 'POVRATNICA_D' | 'MEDJUSKLADISNICA' | 'PRENOS' | 'INVENTAR' | 'OTPIS'
type StatusDokumenta = 'NACRT' | 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN'

interface StavkaPayload {
    proizvod: number
    slot_ulaza: number | null
    slot_izlaza: number | null
    kolicina: number
    cena: number
}

export const getDokumenta = () => {
    return api.get<Dokument[]>(`/documentss/dokumenta/`);
}

export const getDokument = (id: number) => {
    return api.get<Dokument>(`/documentss/dokumenta/${id}/`);
}

export const createDokument = (data: { tip: TipDokumenta, datum_vreme: string, poslovni_partner: number | null, zaposleni: number, skladiste_ulaza: number | null, skladiste_izlaza: number | null,  transport: number | null, status: StatusDokumenta, stavke: StavkaPayload[] }) => {
    return api.post<Dokument>(`/documentss/dokumenta/`, data);
}

export const updateDokument = (id: number, data: { tip: TipDokumenta, datum_vreme: string, poslovni_partner: number | null, zaposleni: number, skladiste_ulaza: number | null, skladiste_izlaza: number | null,  transport: number | null, status: StatusDokumenta, stavke: StavkaPayload[] }) => {
    return api.put<Dokument>(`/documentss/dokumenta/${id}/`, data);
}

export const deleteDokument = (id: number) => {
    return api.delete(`/documentss/dokumenta/${id}/`);
}