import { useEffect, useState } from "react";
import { getPartneri } from "@/api/partner";
import type { PoslovniPartner } from "@/types/partner";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const usePartneri = () => {
    const [partneri, setPartneri] = useState<PoslovniPartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPartneri()
            .then(res => {
                const data = res.data as PaginatedResponse<PoslovniPartner> | PoslovniPartner[];
                setPartneri(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju partnera.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { partneri, isLoading, error }
}

export default usePartneri