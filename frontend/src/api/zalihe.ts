import api from "./axios";
import type { Zalihe } from "@/types/inventar";

export const getZalihe = () => {
    return api.get<Zalihe[]>(`/inventory/zalihe/`);
}

export const getZaliha = (id: number) => {
    return api.get<Zalihe>(`/inventory/zalihe/${id}/`);
}

export const createZaliha = (data: Partial<Zalihe>) => {
    return api.post<Zalihe>(`/inventory/zalihe/`, data);
}

export const updateZaliha = (id: number, data: Partial<Zalihe>) => {
    return api.put<Zalihe>(`/inventory/zalihe/${id}/`, data);
}

export const deleteZaliha = (id: number) => {
    return api.delete(`/inventory/zalihe/${id}/`);
}