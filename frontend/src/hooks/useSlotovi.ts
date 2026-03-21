import { useEffect, useState } from "react";
import { getSlotovi } from "@/api/slot";
import type { Slot } from "@/types/skladiste";

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}

const useSlotovi = () => { 
    const [slotovi, setSlotovi] = useState<Slot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSlotovi()
            .then(res => {
                const data = res.data as PaginatedResponse<Slot> | Slot[];
                setSlotovi(Array.isArray(data) ? data : data.results);
            })
            .catch(() => setError('Greska pri ucitavanju slotova.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { slotovi, isLoading, error }
}

export default useSlotovi