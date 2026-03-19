import api from "./axios";
import type { Proizvod } from "@/types/inventar";

export const getProizvodi = () => {
    return api.get<Proizvod[]>(`/inventory/proizvodi/`);
}

export const getProizvod = (id: number) => {
    return api.get<Proizvod>(`/inventory/proizvodi/${id}/`);
}

export const createProizvod = (data: Partial<Proizvod>) => {
    return api.post<Proizvod>(`/inventory/proizvodi/`, data);
}

export const updateProizvod = (id: number, data: Partial<Proizvod>) => {
    return api.put<Proizvod>(`/inventory/proivodi/${id}/`, data);
}

export const deleteProizvod = (id: number) => {
    return api.delete(`/inventory/proizvodi/${id}/`);
}