import { useEffect, useState, useCallback } from "react";
import { getSlot } from "@/api/slot";
import type { Slot } from "@/types/skladiste";

const useSlot = (id: number) => { 
    const [slot, setSlot] = useState<Slot | null>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(() => {       
        setIsLoading(true)
        getSlot(id)
            .then(res => setSlot(res.data))
            .catch(() => setError('Greska pri ucitavanju slotova.'))
            .finally(() => setIsLoading(false))
    }, [id])

    useEffect(() => {
        fetchData()                             
    }, [fetchData]);

    return { slot, isLoading, error, refetch: fetchData }
}

export default useSlot