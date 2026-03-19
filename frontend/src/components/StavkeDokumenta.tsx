import { PackageSearch, LogIn, LogOut, Hash, Banknote, Receipt } from "lucide-react";

interface StavkeDokumentaProps {
    proizvod: string;
    slotUlaza: string;
    slotIzlaza: string;
    kolicina: number;
    jedinicaMere: string;
    cena: number;
}

const StavkeDokumenta = ({ proizvod, slotUlaza, slotIzlaza, kolicina, jedinicaMere, cena }: StavkeDokumentaProps) => {
    const ukupno = kolicina * cena;

    return(
        <div className="flex flex-col gap-3 w-[32%] p-4 bg-sidebar text-sidebar-text rounded-xl transition-all duration-300 hover:bg-sidebar-hover hover:transform-[translateY(-5px)]">
            <div className="flex flex-col gap-1.5 text-sm">
                <strong className="flex items-center gap-2"><PackageSearch size={14} className="text-text-muted shrink-0" />{proizvod}</strong>
                <p className="flex items-center gap-2"><LogIn size={14} className="text-text-muted shrink-0" />Slot ulaza: {slotUlaza}</p>
                <p className="flex items-center gap-2"><LogOut size={14} className="text-text-muted shrink-0" />Slot izlaza: {slotIzlaza}</p>
                <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />Količina: {kolicina} {jedinicaMere}</p>
                <p className="flex items-center gap-2"><Banknote size={14} className="text-text-muted shrink-0" />Cena: {cena} rsd</p>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <p className="flex items-center gap-2"><Receipt size={14} className="text-text-muted shrink-0" />Ukupno: {ukupno.toLocaleString('sr-RS')} rsd</p>
            </div>
        </div>
    );
}

export default StavkeDokumenta