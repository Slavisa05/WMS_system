import api from "./axios";
import type { Vozilo } from "@/types/transport";

export const getVozila = () => {
    return api.get<Vozilo[]>(`/transport/vozila/`);
}

export const getVozilo = (id: number) => {
    return api.get<Vozilo>(`/transport/vozila/${id}/`);
}

export const createVozilo = (data: { model: string, registarski_broj: string, datum_registracije: string, poslednji_tehnicki: string, zaduzeni_vozac: number }) => {
    return api.post<Vozilo>(`/transport/vozila/`, data);
}

export const updateVozilo = (id: number, data: { model: string, registarski_broj: string, datum_registracije: string, poslednji_tehnicki: string, zaduzeni_vozac: number }) => {
    return api.put<Vozilo>(`/transport/vozila/${id}/`, data);
}

export const deleteVozilo = (id: number) => {
    return api.delete(`/transport/vozila/${id}/`);
}