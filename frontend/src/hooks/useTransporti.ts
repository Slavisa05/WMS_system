import { useEffect, useState } from "react";
import { getTransporti } from "@/api/transport";
import type { Transport } from "@/types/transport";

const useTransporti = () => {
    const [transporti, setTransporti] = useState<Transport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTransporti()
            .then(res => setTransporti(res.data))
            .catch(() => setError('Greska pri ucitavanju transporta.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { transporti, isLoading, error }
}

export default useTransporti