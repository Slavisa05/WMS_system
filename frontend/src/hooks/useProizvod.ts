import { useEffect, useState } from "react";
import { getProizvod } from "@/api/proizvod";
import type { Proizvod } from "@/types/inventar";

const useProizvod = (id: number) => {
    const [proizvod, setProizvod] = useState<Proizvod>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProizvod(id)
            .then(res => setProizvod(res.data))
            .catch(() => setError('Greska pri ucitavanju proizvoda.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { proizvod, isLoading, error }
}

export default useProizvod