import api from "./axios";
import type { Sektor } from "@/types/skladiste";

export const getSektore = () => {
    return api.get<Sektor[]>(`/warehouse/sektori/`);
}

export const getSektor = (id: number) => {
    return api.get<Sektor>(`/warehouse/sektori/${id}/`);
}

export const createSektor = (data: Partial<Sektor>) => {
    return api.post<Sektor>(`/warehouse/sektori/`, data);
}

export const updateSektor = (id: number, data: Partial<Sektor>) => {
    return api.put<Sektor>(`/warehouse/sektori/${id}/`, data);
}

export const deleteSektor = (id: number) => {
    return api.delete(`/warehouse/sektori/${id}/`);
}