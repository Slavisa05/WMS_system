import { Truck, User, CalendarArrowUp, CalendarArrowDown, Activity, StickyNote } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";

interface Vozilo {
    model: string;
    registarskiBroj: string;
}

interface Transport {
    id: number;
    vozilo: Vozilo;
    vozac: string;
    polazak: string;
    dolazak?: string;
    status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO';
}

const TransportiDetaljiPage = () => {
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Transport" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Transport #212</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Truck size={16} className="text-text-muted shrink-0" />Vozilo: VW Crafter BG-1234-BG</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Vozac: Mirko Mirkovic</p>
                <p className="flex items-center gap-2"><CalendarArrowUp size={16} className="text-text-muted shrink-0" />Polazak: 18/03/2026 18:00h</p>
                <p className="flex items-center gap-2"><CalendarArrowDown size={16} className="text-text-muted shrink-0" />Dolazak: /</p>
                <p className="flex items-center gap-2"><Activity size={16} className="text-text-muted shrink-0" />Status: U_TOKU</p>
                <p className="flex items-center gap-2"><StickyNote size={16} className="text-text-muted shrink-0" />Napomena: Mirko polako vozi</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Dokumenti ovog transporta</h2>
                <div className="flex flex-col gap-2">
                    <DocumentLogItem id={1234} tip="PRIJEMNICA" datumVreme="11/03/2026 12:25:30h" status="ODOBREN" zaposleni="Mirko Mirkovic" />
                    <DocumentLogItem id={2245} tip="POVRATNICA_K" datumVreme="19/10/2025 19:00:00h" status="ODOBREN" zaposleni="Mirko Mirkovic" />
                </div>
            </div>
        </section>
    );
}

export default TransportiDetaljiPage