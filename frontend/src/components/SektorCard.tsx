import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Sektor } from "@/types/skladiste";
import useSlotovi from "@/hooks/useSlotovi";

const SektorCard = ({ id, naziv }: Sektor) => {
    const { slotovi } = useSlotovi();
    const brojSlotova = slotovi.filter(sl => sl.sektor.id === id).length;

    return(
        <Link to={`/sektori/${id}`}>
            <div className="cursor-pointer flex justify-between items-center w-full px-5 py-2.5 bg-background text-text rounded-xl transition-all ease-out duration-300 hover:bg-sidebar hover:text-background">
                <strong>{naziv}</strong>
                <p className="opacity-80">Broj slotova: {brojSlotova}</p>
                <ChevronRight size={16} className="shrink-0 opacity-60" />
            </div>
        </Link>
    );
}

export default SektorCard

