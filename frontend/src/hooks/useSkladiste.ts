import { useEffect, useState } from "react";
import { getSkladiste } from "@/api/skladiste";
import type { Skladiste } from "@/types/skladiste";

const useSkladiste = (id: number) => {
    const [skladiste, setSkladiste] = useState<Skladiste | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSkladiste(id)
            .then(res => setSkladiste(res.data))
            .catch(() => setError('Greska pri ucitavanju skladista.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { skladiste, isLoading, error }
}

export default useSkladiste