import { useEffect, useState } from "react";
import { getDokument } from "@/api/dokument";
import type { Dokument } from "@/types/dokument";

const useDokument = (id: number) => {
    const [dokument, setDokument] = useState<Dokument>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDokument(id)
            .then(res => setDokument(res.data))
            .catch(() => setError('Greska pri ucitavanju dokumenta.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { dokument, isLoading, error }
}

export default useDokument