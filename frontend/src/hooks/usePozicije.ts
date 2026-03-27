import { useEffect, useState, useCallback } from "react";
import { getPozicije } from "@/api/zaposleni";
import type { Pozicija } from "@/types/zaposleni";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const usePozicije = () => {
    const [pozicije, setPozicije] = useState<Pozicija[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getPozicije()
            .then(res => {
                const data = res.data as PaginatedResponse<Pozicija> | Pozicija[];
                setPozicije(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greška pri učitavanju pozicija.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { pozicije, isLoading, error, refetch: fetchData }
}

export default usePozicije
