import { useEffect, useState } from "react";
import { getTransport } from "@/api/transport";
import type { Transport } from "@/types/transport";

const useTransport = (id: number) => {
    const [transport, setTransport] = useState<Transport>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTransport(id)
            .then(res => setTransport(res.data))
            .catch(() => setError('Greska pri ucitavanju transporta.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { transport, isLoading, error }
}

export default useTransport