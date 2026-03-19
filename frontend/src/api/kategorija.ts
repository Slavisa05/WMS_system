import api from "./axios";
import type { Kategorija } from "@/types/inventar";

export const getKategorije = () => {
    return api.get<Kategorija[]>(`/inventory/kategorije/`);
}

export const getKategorija = (id: number) => {
    return api.get<Kategorija>(`/inventory/kategorije/${id}/`);
}

export const createKategorija = (data: Partial<Kategorija>) => {
    return api.post<Kategorija>(`/inventory/kategorije/`, data);
}

export const updateKategorija = (id: number, data: Partial<Kategorija>) => {
    return api.put<Kategorija>(`/inventory/kategorije/${id}/`, data);
}

export const deleteKategorija = (id: number) => {
    return api.delete(`/inventory/kategorije/${id}/`);
}