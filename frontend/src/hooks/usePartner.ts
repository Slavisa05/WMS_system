import { useEffect, useState } from "react";
import { getPartner } from "@/api/partner";
import type { PoslovniPartner } from "@/types/partner";

const usePartner = (id: number) => {
    const [partner, setPartner] = useState<PoslovniPartner>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPartner(id)
            .then(res => setPartner(res.data))
            .catch(() => setError('Greska pri ucitavanju partnera.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { partner, isLoading, error }
}

export default usePartner