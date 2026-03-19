import api from "./axios";
import type { PoslovniPartner } from "@/types/partner";

export const getPartneri = () => {
    return api.get<PoslovniPartner[]>(`/partners/partneri/`);
}

export const getPartner = (id: number) => {
    return api.get<PoslovniPartner>(`/partners/partneri/${id}/`);
}

export const createPartner = (data: Partial<PoslovniPartner>) => {
    return api.post<PoslovniPartner>(`/partners/partneri/`, data);
}

export const updatePartner = (id: number, data: Partial<PoslovniPartner>) => {
    return api.put<PoslovniPartner>(`/partners/partneri/${id}/`, data);
}

export const deletePartner = (id: number) => {
    return api.delete(`/partners/partneri/${id}/`);
}