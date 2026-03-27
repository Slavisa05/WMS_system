import { useEffect, useState, useCallback } from "react";
import { getZalihe } from "@/api/zalihe";
import type { Zalihe } from "@/types/inventar";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useZalihe = () => {
    const [zalihe, setZalihe] = useState<Zalihe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        setIsLoading(true)
        getZalihe()
            .then(res => {
                const data = res.data as PaginatedResponse<Zalihe> | Zalihe[];
                setZalihe(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju zaliha.'))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return { zalihe, isLoading, error, refetch: fetchData }
}

export default useZalihe