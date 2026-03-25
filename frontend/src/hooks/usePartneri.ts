import { useEffect, useState, useCallback } from "react";
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

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getPartneri()
            .then(res => {
                const data = res.data as PaginatedResponse<PoslovniPartner> | PoslovniPartner[];
                setPartneri(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju partnera.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { partneri, isLoading, error, refetch: fetchData }
}

export default usePartneri