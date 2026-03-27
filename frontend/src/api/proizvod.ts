import api from "./axios";
import type { Proizvod } from "@/types/inventar";

export const getProizvodi = () => {
    return api.get<Proizvod[]>(`/inventory/proizvodi/`);
}

export const getProizvod = (id: number) => {
    return api.get<Proizvod>(`/inventory/proizvodi/${id}/`);
}

export const createProizvod = (data: { naziv: string, barkod: string, sifra: string, jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol', kategorija: number }) => {
    return api.post<Proizvod>(`/inventory/proizvodi/`, data);
}

export const updateProizvod = (id: number, data: { naziv: string, barkod: string, sifra: string, jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol', kategorija: number }) => {
    return api.patch<Proizvod>(`/inventory/proizvodi/${id}/`, data);
}

export const deleteProizvod = (id: number) => {
    return api.delete(`/inventory/proizvodi/${id}/`);
}