import { useEffect, useState, useCallback } from "react";
import { getDokument } from "@/api/dokument";
import type { Dokument } from "@/types/dokument";

const useDokument = (id: number | null) => {
    const [dokument, setDokument] = useState<Dokument>();
    const [isLoading, setIsLoading] = useState(id !== null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {
        if (id === null) return
        setIsLoading(true)
        getDokument(id)
            .then(res => setDokument(res.data))
            .catch(() => setError('Greska pri ucitavanju dokumenta.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { dokument, isLoading, error, refetch: fetchData }
}

export default useDokument