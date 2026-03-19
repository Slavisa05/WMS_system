import api from "./axios";
import type { Slot } from "@/types/skladiste";

export const getSlotovi = () => {
    return api.get<Slot[]>(`/warehouse/slotovi/`);
}

export const getSlot = (id: number) => {
    return api.get<Slot>(`/warehouse/slotovi/${id}/`);
}

export const createSlot = (data: Partial<Slot>) => {
    return api.post<Slot>(`/warehouse/slotovi/`, data);
}

export const updateSlot = (id: number, data: Partial<Slot>) => {
    return api.put<Slot>(`/warehouse/slotovi/${id}/`, data);
}

export const deleteSlot = (id: number) => {
    return api.delete(`/warehouse/slotovi/${id}`);
}