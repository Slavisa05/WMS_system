import { useEffect, useState, useCallback } from "react";
import { getTransport } from "@/api/transport";
import type { Transport } from "@/types/transport";

const useTransport = (id: number) => {
    const [transport, setTransport] = useState<Transport>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getTransport(id)
            .then(res => setTransport(res.data))
            .catch(() => setError('Greska pri ucitavanju transporta.'))
            .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { transport, isLoading, error, refetch: fetchData }
}

export default useTransport