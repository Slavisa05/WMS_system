import { useEffect, useState } from "react";
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

    useEffect(() => {
        getDokumenta()
            .then(res => {
                const data = res.data as PaginatedResponse<Dokument> | Dokument[];
                setDokumenta(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju dokumenata.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { dokumenta, isLoading, error }
}

export default useDokumenta