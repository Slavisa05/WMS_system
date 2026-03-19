import { useEffect, useState } from "react";
import { getSlotovi } from "@/api/slot";
import type { Slot } from "@/types/skladiste";

const useSlotovi = () => { 
    const [slotovi, setSlotovi] = useState<Slot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSlotovi()
            .then(res => setSlotovi(res.data))
            .catch(() => setError('Greska pri ucitavanju slotova.'))
            .finally(() => setIsLoading(false))
    }, []);

    return { slotovi, isLoading, error }
}

export default useSlotovi