import api from "./axios";
import type { Transport } from "@/types/transport";

export const getTransporti = () => {
    return api.get<Transport[]>(`/transport/transporti/`);
}

export const getTransport = (id: number) => {
    return api.get<Transport>(`/transport/transporti/${id}/`);
}

export const createTransport = (data: { vozac: number, vozilo: number, datum_polaska: string, datum_zavrsetka: string | null, status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO', napomena: string | null }) => {
    return api.post<Transport>(`/transport/transporti/`, data);
}

export const updateTransport = (id: number, data: { vozac: number, vozilo: number, datum_polaska: string, datum_zavrsetka: string | null, status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO', napomena: string | null }) => {
    return api.put<Transport>(`/transport/transporti/${id}/`, data);
}

export const deleteTransport = (id: number) => {
    return api.delete(`/transpor/transporti/${id}/`);
}