import { useEffect, useState } from "react";
import { getSektore } from "@/api/sektor";
import type { Sektor } from "@/types/skladiste";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useSektore = () => {
    const [sektori, setSektore] = useState<Sektor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSektore()
            .then(res => {
                const data = res.data as PaginatedResponse<Sektor> | Sektor[];
                setSektore(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju sektora.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { sektori, isLoading, error }
}

export default useSektore