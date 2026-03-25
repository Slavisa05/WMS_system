import { useEffect, useState, useCallback } from "react";
import { getKategorija } from "@/api/kategorija";
import type { Kategorija } from "@/types/inventar";

const useKategorija = (id: number) => {
    const [kategorija, setKategorija] = useState<Kategorija | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getKategorija(id)
            .then(res => setKategorija(res.data))
            .catch(() => setError('Greška pri učitavanju kategorije.'))
            .finally(() => setIsLoading(false));
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { kategorija, isLoading, error, refetch: fetchData } 
}

export default useKategorija