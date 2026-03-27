import { useEffect, useState, useCallback } from "react";
import { getVozila } from "@/api/vozilo";
import type { Vozilo } from "@/types/transport";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useVozila = () => {
    const [vozila, setVozila] = useState<Vozilo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getVozila()
            .then(res => {
                const data = res.data as PaginatedResponse<Vozilo> | Vozilo[];
                setVozila(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju vozila.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { vozila, isLoading, error, refetch: fetchData }
}

export default useVozila