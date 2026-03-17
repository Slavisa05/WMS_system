import { Layers, Warehouse, LayoutGrid, Package, Lock } from "lucide-react";

interface ZalihePoSlotovimaProps {
    slotId: number;
    slotNaziv: string;
    sektorId: number;
    sektorNaziv: string;
    skladisteId: number;
    skladisteNaziv: string;
    kolicina: number;
    rezervisanaKolicina: number;
}

const ZalihePoSlotovima = ({ slotId, slotNaziv, sektorId, sektorNaziv, skladisteId, skladisteNaziv, kolicina, rezervisanaKolicina }: ZalihePoSlotovimaProps) => {
    const slobodnaKolicina = kolicina - rezervisanaKolicina;

    return(
        <div className="flex flex-col gap-3 w-[49%] p-4 bg-sidebar text-sidebar-text rounded-xl transition-all duration-300 hover:bg-sidebar-hover hover:transform-[translateY(-5px)]">
            <div className="flex flex-col gap-1.5 text-sm">
                <p className="flex items-center gap-2"><Layers size={14} className="text-text-muted shrink-0" />{slotNaziv} <span className="opacity-50">#{slotId}</span></p>
                <p className="flex items-center gap-2"><LayoutGrid size={14} className="text-text-muted shrink-0" />{sektorNaziv} <span className="opacity-50">#{sektorId}</span></p>
                <p className="flex items-center gap-2"><Warehouse size={14} className="text-text-muted shrink-0" />{skladisteNaziv} <span className="opacity-50">#{skladisteId}</span></p>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <p className="flex items-center gap-2"><Package size={14} className="text-text-muted shrink-0" />Količina: {kolicina}</p>
                <p className="flex items-center gap-2"><Lock size={14} className="text-text-muted shrink-0" />Rezervisano: {rezervisanaKolicina}</p>
                <p className="opacity-70">Slobodno: {slobodnaKolicina}</p>
            </div>
        </div>
    );
}

export default ZalihePoSlotovima