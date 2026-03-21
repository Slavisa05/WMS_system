import { useEffect, useState } from "react";
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

    useEffect(() => {
        getZalihe()
            .then(res => {
                const data = res.data as PaginatedResponse<Zalihe> | Zalihe[];
                setZalihe(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju zaliha.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { zalihe, isLoading, error }
}

export default useZalihe