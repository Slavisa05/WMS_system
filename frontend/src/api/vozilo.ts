import api from "./axios";
import type { Vozilo } from "@/types/transport";

export const getVozila = () => {
    return api.get<Vozilo[]>(`/transport/vozila/`);
}

export const getVozilo = (id: number) => {
    return api.get<Vozilo>(`/transport/vozila/${id}/`);
}

export const createVozilo = (data: Partial<Vozilo>) => {
    return api.post<Vozilo>(`/transport/vozila/`, data);
}

export const updateVozilo = (id: number, data: Partial<Vozilo>) => {
    return api.put<Vozilo>(`/transport/vozila/${id}/`, data);
}

export const deleteVozilo = (id: number) => {
    return api.delete(`/transport/vozila/${id}/`);
}