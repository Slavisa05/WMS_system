import { useEffect, useState } from "react";
import { getPartneri } from "@/api/partner";
import type { PoslovniPartner } from "@/types/partner";

const usePartneri = () => {
    const [partneri, setPartneri] = useState<PoslovniPartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPartneri()
            .then(res => setPartneri(res.data))
            .catch(() => setError('Greska pri ucitavanju partnera.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { partneri, isLoading, error }
}

export default usePartneri