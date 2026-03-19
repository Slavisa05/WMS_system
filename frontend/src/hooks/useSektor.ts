import { useEffect, useState } from "react";
import { getSektor } from "@/api/sektor";
import type { Sektor } from "@/types/skladiste";

const useSektor = (id: number) => {
    const [sektor, setSektor] = useState<Sektor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSektor(id)
            .then(res => setSektor(res.data))
            .catch(() => setError('Greska pri ucitavanju sektora.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { sektor, isLoading, error }
}

export default useSektor