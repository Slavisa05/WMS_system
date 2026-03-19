import api from "./axios";
import type { Skladiste } from "@/types/skladiste";

export const getSkladista = () => {
    return api.get<Skladiste[]>(`/warehouse/skladista/`);
}

export const getSkladiste = (id: number) => {
    return api.get<Skladiste>(`/warehouse/skladista/${id}`);
}

export const createSkladiste = (data: Partial<Skladiste>) => {
    return api.post<Skladiste>(`/warehouse/skladista/`, data);
}

export const updateSkladiste = (id: number, data: Partial<Skladiste>) => {
    return api.put<Skladiste>(`/warehouse/skladista/${id}/`, data);
}

export const deleteSkladiste = (id: number) => {
    return api.delete(`/warehouse/skladista/${id}/`);
}