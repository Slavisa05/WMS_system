import { useEffect, useState } from "react";
import { getKategorije } from "@/api/kategorija";
import type { Kategorija } from "@/types/inventar";

const useKategorije = () => {
    const [kategorije, setKategorije] = useState<Kategorija[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getKategorije()
            .then(res => setKategorije(res.data))
            .catch(() => setError('Greska pri ucitavanju kategorija.'))
            .finally(() => setIsLoading(false));
    }, []);

    return { kategorije, isLoading, error }
}

export default useKategorije