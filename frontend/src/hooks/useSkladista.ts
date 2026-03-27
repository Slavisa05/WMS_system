import { useEffect, useState, useCallback } from "react";
import { getSkladista } from "@/api/skladiste";
import type { Skladiste } from "@/types/skladiste";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useSkladista = () => {
    const [skladista, setSkladista] = useState<Skladiste[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getSkladista()
            .then(res => {
                const data = res.data as PaginatedResponse<Skladiste> | Skladiste[];
                setSkladista(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju skladista.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { skladista, isLoading, error, refetch: fetchData }
}

export default useSkladista