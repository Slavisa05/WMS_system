import { useEffect, useState, useCallback } from "react";
import { getDokumenta } from "@/api/dokument";
import type { Dokument } from "@/types/dokument";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useDokumenta = () => {
    const [dokumenta, setDokumenta] = useState<Dokument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getDokumenta()
            .then(res => {
                const data = res.data as PaginatedResponse<Dokument> | Dokument[];
                setDokumenta(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju dokumenata.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { dokumenta, isLoading, error, refetch: fetchData }
}

export default useDokumenta