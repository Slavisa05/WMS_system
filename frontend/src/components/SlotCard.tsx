import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Slot } from "@/types/skladiste";

const SlotCard = ({ id, naziv, kapacitet, slobodan_kapacitet }: Slot) => {
    return(
        <Link to={`/slotovi/${id}`}>
            <div className="cursor-pointer flex justify-between items-center w-full px-5 py-2.5 bg-background text-text rounded-xl transition-all ease-out duration-300 hover:bg-sidebar hover:text-background">
                <strong>{naziv}</strong>
                <p className="opacity-80">Kapacitet: {kapacitet} · Slobodan kapacitet: {slobodan_kapacitet}</p>
                <ChevronRight size={16} className="shrink-0 opacity-60" />
            </div>
        </Link>
    );
}

export default SlotCard

