import { useEffect, useState } from "react";
import { getProizvodi } from "@/api/proizvod";
import type { Proizvod } from "@/types/inventar";

const useProizvodi = () => {
    const [proizvodi, setProizvodi] = useState<Proizvod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProizvodi()
            .then(res => setProizvodi(res.data))
            .catch(() => setError('Greska pri ucitavanju proizvoda.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { proizvodi, isLoading, error }
}

export default useProizvodi