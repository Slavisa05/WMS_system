import { useEffect, useState } from "react";
import { getKategorija } from "@/api/kategorija";
import type { Kategorija } from "@/types/inventar";

const useKategorija = (id: number) => {
    const [kategorija, setKategorije] = useState<Kategorija>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getKategorija(id)
            .then(res => setKategorije(res.data))
            .catch(() => setError('Greska pri ucitavanju kategorije.'))
            .finally(() => setIsLoading(false));
    }, [id]);

    return { kategorija, isLoading, error }
}

export default useKategorija