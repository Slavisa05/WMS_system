import { useEffect, useState } from "react";
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

    useEffect(() => {
        getVozila()
            .then(res => {
                const data = res.data as PaginatedResponse<Vozilo> | Vozilo[];
                setVozila(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju vozila.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { vozila, isLoading, error }
}

export default useVozila