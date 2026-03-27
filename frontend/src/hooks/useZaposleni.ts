import { useEffect, useState, useCallback } from "react";
import { getZaposleni } from "@/api/zaposleni";
import type { Zaposleni } from "@/types/zaposleni";

const useZaposleni = (id: number) => {
    const [zaposleni, setZaposleni] = useState<Zaposleni>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getZaposleni(id)
            .then(res => setZaposleni(res.data))
            .catch(() => setError('Greska pri ucitavanju zaposlenog.'))
            .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { zaposleni, isLoading, error, refetch: fetchData }
}

export default useZaposleni
