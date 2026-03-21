import { useEffect, useState } from "react";
import { getTransporti } from "@/api/transport";
import type { Transport } from "@/types/transport";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useTransporti = () => {
    const [transporti, setTransporti] = useState<Transport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTransporti()
            .then(res => {
                const data = res.data as PaginatedResponse<Transport> | Transport[];
                setTransporti(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju transporta.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { transporti, isLoading, error }
}

export default useTransporti