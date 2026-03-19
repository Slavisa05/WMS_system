import api from "./axios";
import type { Dokument } from "@/types/dokument";

export const getDokumenta = () => {
    return api.get<Dokument[]>(`/documentss/dokumenta/`);
}

export const getDokument = (id: number) => {
    return api.get<Dokument>(`/documentss/dokumenta/${id}/`);
}

export const createDokument = (data: Partial<Dokument>) => {
    return api.post<Dokument>(`/documentss/dokumenta/`, data);
}

export const updateDokument = (id: number, data: Partial<Dokument>) => {
    return api.put<Dokument>(`/documentss/dokumenta/${id}/`, data);
}

export const deleteDokument = (id: number) => {
    return api.delete(`/documentss/dokumenta/${id}/`);
}