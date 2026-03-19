import { useEffect, useState } from "react";
import { getSkladista } from "@/api/skladiste";
import type { Skladiste } from "@/types/skladiste";

const useSkladista = () => {
    const [skladista, setSkladista] = useState<Skladiste[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSkladista()
            .then(res => setSkladista(res.data))
            .catch(() => setError('Greska pri ucitavanju skladista.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { skladista, isLoading, error }
}

export default useSkladista