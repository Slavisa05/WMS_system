import { useEffect, useState, useCallback } from "react";
import { getVozilo } from "@/api/vozilo";
import type { Vozilo } from "@/types/transport";

const useVozilo = (id: number) => {
    const [vozilo, setVozilo] = useState<Vozilo>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getVozilo(id)
            .then(res => setVozilo(res.data))
            .catch(() => setError('Greska pri ucitavanju vozila.'))
            .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { vozilo, isLoading, error, refetch: fetchData }
}

export default useVozilo