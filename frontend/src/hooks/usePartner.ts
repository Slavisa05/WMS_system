import { useEffect, useState, useCallback } from "react";
import { getPartner } from "@/api/partner";
import type { PoslovniPartner } from "@/types/partner";

const usePartner = (id: number) => {
    const [partner, setPartner] = useState<PoslovniPartner>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getPartner(id)
            .then(res => setPartner(res.data))
            .catch(() => setError('Greška pri učitavanju kategorije.'))
            .finally(() => setIsLoading(false));
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { partner, isLoading, error, refetch: fetchData }
}

export default usePartner