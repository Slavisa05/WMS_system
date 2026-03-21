import { useEffect, useState } from "react";
import { getZaposleni } from "@/api/zaposleni";
import type { Zaposleni } from "@/types/zaposleni";

const useZaposleni = (id: number) => {
    const [zaposleni, setZaposleni] = useState<Zaposleni>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getZaposleni(id)
            .then(res => setZaposleni(res.data))
            .catch(() => setError('Greska pri ucitavanju zaposlenog.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { zaposleni, isLoading, error }
}

export default useZaposleni
