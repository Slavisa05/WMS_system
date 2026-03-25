import { useEffect, useState, useCallback } from "react";
import { getKategorije } from "@/api/kategorija";
import type { Kategorija } from "@/types/inventar";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useKategorije = () => {
    const [kategorije, setKategorije] = useState<Kategorija[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getKategorije()
            .then(res => {
                const data = res.data as PaginatedResponse<Kategorija> | Kategorija[];
                setKategorije(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju kategorija.'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { kategorije, isLoading, error, refetch: fetchData }
}

export default useKategorije