import { useEffect, useState, useCallback } from "react";
import { getProizvodi } from "@/api/proizvod";
import type { Proizvod } from "@/types/inventar";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useProizvodi = () => {
    const [proizvodi, setProizvodi] = useState<Proizvod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getProizvodi()
            .then(res => {
                const data = res.data as PaginatedResponse<Proizvod> | Proizvod[];
                setProizvodi(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju proizvoda.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { proizvodi, isLoading, error, refetch: fetchData }
}

export default useProizvodi