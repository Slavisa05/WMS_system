import { useEffect, useState } from "react";
import { getDokumenta } from "@/api/dokument";
import type { Dokument } from "@/types/dokument";

const useDokumenta = () => {
    const [dokumenta, setDokumenta] = useState<Dokument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDokumenta()
            .then(res => setDokumenta(res.data))
            .catch(() => setError('Greska pri ucitavanju dokumenata.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { dokumenta, isLoading, error }
}

export default useDokumenta