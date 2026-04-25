import api from "./axios";
import type { Zaposleni, Pozicija } from "@/types/zaposleni";

export const getZaposlene = () => {
    return api.get<Zaposleni[]>(`/accounts/zaposleni/`);
}

export const getPozicije = () => {
    return api.get<Pozicija[]>(`/accounts/pozicije/`);
}

export const getZaposleni = (id: number) => {
    return api.get<Zaposleni>(`/accounts/zaposleni/${id}/`);
}

export const createZaposleni = (data: { ime: string, prezime: string, jmbg: string, broj_telefona: string, datum_rodjenja: string, datum_zaposlenja: string, ugovor_do: string | null, pozicija: number }) => {
    return api.post<Zaposleni>(`/accounts/zaposleni/`, data);
}

export const updateZaposleni = (id: number, data: { ime: string, prezime: string, jmbg: string, broj_telefona: string, datum_rodjenja: string, datum_zaposlenja: string, ugovor_do: string | null, pozicija: number }) => {
    return api.put<Zaposleni>(`/accounts/zaposleni/${id}/`, data);
}

export const deleteZaposleni = (id: number) => {
    return api.delete(`/accounts/zaposleni/${id}/`);
}