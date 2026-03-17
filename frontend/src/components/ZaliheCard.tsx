import { Plus, Search, Package, Lock, PackageOpen, Layers, LayoutGrid, Warehouse } from "lucide-react";

interface Zaliha {
    id: number;
    proizvodNaziv: string;
    slotNaziv: string;
    sektorNaziv: string;
    skladisteNaziv: string;
    kolicina: number;
    rezervisanaKolicina: number;
}

const ZaliheCard = ({ id, proizvodNaziv, slotNaziv, sektorNaziv, skladisteNaziv, kolicina, rezervisanaKolicina }: Zaliha) => {
    const slobodno = kolicina - rezervisanaKolicina;

    return (
        <div className="basis-[calc(50%-0.5rem)] min-w-64 grow h-full flex flex-col gap-3 p-4 bg-sidebar text-sidebar-text rounded-xl transition-all duration-300 hover:bg-sidebar-hover hover:transform-[translateY(-5px)]">
            <strong className="text-lg">{proizvodNaziv}</strong>
            <div className="flex flex-col gap-1.5 text-sm">
                <p className="flex items-center gap-2"><Layers size={14} className="text-text-muted shrink-0" />{slotNaziv}</p>
                <p className="flex items-center gap-2"><LayoutGrid size={14} className="text-text-muted shrink-0" />{sektorNaziv}</p>
                <p className="flex items-center gap-2"><Warehouse size={14} className="text-text-muted shrink-0" />{skladisteNaziv}</p>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <p className="flex items-center gap-2"><Package size={14} className="text-text-muted shrink-0" />Ukupno: {kolicina}</p>
                <p className="flex items-center gap-2"><Lock size={14} className="text-text-muted shrink-0" />Rezervisano: {rezervisanaKolicina}</p>
                <p className="flex items-center gap-2"><PackageOpen size={14} className="text-text-muted shrink-0" />Slobodno: {slobodno}</p>
            </div>
        </div>
    );
}

export default ZaliheCard