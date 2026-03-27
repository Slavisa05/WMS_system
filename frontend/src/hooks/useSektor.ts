import { useEffect, useState, useCallback } from "react";
import { getSektor } from "@/api/sektor";
import type { Sektor } from "@/types/skladiste";

const useSektor = (id: number) => {
    const [sektor, setSektor] = useState<Sektor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getSektor(id)
            .then(res => setSektor(res.data))
            .catch(() => setError('Greska pri ucitavanju sektora.'))
            .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { sektor, isLoading, error, refetch: fetchData }
}

export default useSektor