import { Layers, Warehouse, LayoutGrid, Package, Lock } from "lucide-react";
import type { Zalihe } from "@/types/inventar";

const ZalihePoSlotovima = ({ slot, kolicina, rezervisana_kolicina }: Zalihe) => {
    const slobodnaKolicina = kolicina - rezervisana_kolicina;

    return(
        <div className="flex flex-col gap-3 w-[49%] p-4 bg-sidebar text-sidebar-text rounded-xl transition-all duration-300 hover:bg-sidebar-hover hover:transform-[translateY(-5px)]">
            <div className="flex flex-col gap-1.5 text-sm">
                <p className="flex items-center gap-2"><Layers size={14} className="text-text-muted shrink-0" />{slot.naziv} <span className="opacity-50">#{slot.id}</span></p>
                <p className="flex items-center gap-2"><LayoutGrid size={14} className="text-text-muted shrink-0" />{slot.sektor.naziv} <span className="opacity-50">#{slot.sektor.id}</span></p>
                <p className="flex items-center gap-2"><Warehouse size={14} className="text-text-muted shrink-0" />{slot.sektor.skladiste.naziv} <span className="opacity-50">#{slot.sektor.skladiste.id}</span></p>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <p className="flex items-center gap-2"><Package size={14} className="text-text-muted shrink-0" />Količina: {kolicina}</p>
                <p className="flex items-center gap-2"><Lock size={14} className="text-text-muted shrink-0" />Rezervisano: {rezervisana_kolicina}</p>
                <p className="opacity-70">Slobodno: {slobodnaKolicina}</p>
            </div>
        </div>
    );
}

export default ZalihePoSlotovima