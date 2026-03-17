import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SektorCardProps {
    id: number;
    naziv: string;
    brojSlotova: number;
}

const SektorCard = ({ id, naziv, brojSlotova }: SektorCardProps) => {
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

