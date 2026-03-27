import { useEffect, useState, useCallback } from "react";
import { getZaposlene } from "@/api/zaposleni";
import type { Zaposleni } from "@/types/zaposleni";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useZaposlene = () => {
    const [zaposlene, setZaposlene] = useState<Zaposleni[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getZaposlene()
            .then(res => {
                const data = res.data as PaginatedResponse<Zaposleni> | Zaposleni[];
                setZaposlene(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju zaposlenih.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { zaposlene, isLoading, error, refetch: fetchData }
}

export default useZaposlene