import { useEffect, useState, useCallback } from "react";
import { getSkladiste } from "@/api/skladiste";
import type { Skladiste } from "@/types/skladiste";

const useSkladiste = (id: number) => {
    const [skladiste, setSkladiste] = useState<Skladiste | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getSkladiste(id)
        .then(res => setSkladiste(res.data))
        .catch(() => setError('Greska pri ucitavanju skladista.'))
        .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { skladiste, isLoading, error, refetch: fetchData }
}

export default useSkladiste