import { useEffect, useState } from "react";
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

    useEffect(() => {
        getZaposlene()
            .then(res => {
                const data = res.data as PaginatedResponse<Zaposleni> | Zaposleni[];
                setZaposlene(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju zaposlenih.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { zaposlene, isLoading, error }
}

export default useZaposlene