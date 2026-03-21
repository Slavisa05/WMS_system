import api from "./axios";
import type { Zaposleni } from "@/types/zaposleni";

export const getZaposlene = () => {
    return api.get<Zaposleni[]>(`/accounts/zaposleni/`);
}

export const getZaposleni = (id: number) => {
    return api.get<Zaposleni>(`/accounts/zaposleni/${id}/`);
}

export const createZaposleni = (data: Partial<Zaposleni>) => {
    return api.post<Zaposleni>(`/accounts/zaposleni/`, data);
}

export const updateZaposleni = (id: number, data: Partial<Zaposleni>) => {
    return api.put<Zaposleni>(`/accounts/zaposleni/${id}/`, data);
}

export const deleteZaposleni = (id: number) => {
    return api.delete(`/accounts/zaposleni/${id}`);
}