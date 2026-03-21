import { useEffect, useState } from "react";
import { getZaliha } from "@/api/zalihe";
import type { Zalihe } from "@/types/inventar";

const useZaliha = (id: number) => {
    const [zaliha, setZaliha] = useState<Zalihe>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getZaliha(id)
            .then(res => setZaliha(res.data))
            .catch(() => setError('Greska pri ucitavanju zalihe.'))
            .finally(() => setIsLoading(false))
    }, [id]);

    return { zaliha, isLoading, error }
}

export default useZaliha