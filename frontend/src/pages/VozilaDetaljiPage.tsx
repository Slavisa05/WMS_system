import { Hash, CalendarCheck, Wrench, User } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TransportLogItem from "@/components/TransportLogItem";

interface Vozilo {
    id: number;
    model: string;
    registarskiBroj: string;
    datumRegistracije: string;
    poslednjiTehnicki: string;
    zaduzeniVozac: string;
}

interface TransportLogItemProps {
    id: number;
    vozilo: Vozilo;
    vozac: string;
    polazak: string;
    dolazak?: string;
    status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO';
}

const VozilaDetaljiPage = () => {
    const vozilo = { model: 'VW Crafter', registarskiBroj: 'BG-1234-BG' };

    const transporti = [
        { id: 1, vozac: 'Mirko Mirković', polazak: '15/03/2026 08:00', dolazak: '15/03/2026 14:30', status: 'ZAVRSENO' as const },
        { id: 2, vozac: 'Mirko Mirković', polazak: '18/03/2026 09:00', dolazak: undefined, status: 'U_TOKU' as const },
        { id: 3, vozac: 'Mirko Mirković', polazak: '20/03/2026 10:00', dolazak: undefined, status: 'ZAKAZANO' as const },
    ];

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="VW Crafter" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>VW Crafter</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />Registarski broj: BG-1234-BG</p>
                <p className="flex items-center gap-2"><CalendarCheck size={14} className="text-text-muted shrink-0" />Datum registracije: 19/10/2025</p>
                <p className="flex items-center gap-2"><Wrench size={14} className="text-text-muted shrink-0" />Poslednji tehnicki: 19/02/2026</p>
                <p className="flex items-center gap-2"><User size={14} className="text-text-muted shrink-0" />Zaduzeni vozac: Mirko Mirkovic</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Transporti ovog vozila</h2>
                <div className="flex flex-col w-full gap-2">
                    {transporti.map(t => (
                        <TransportLogItem key={t.id} id={t.id} vozilo={vozilo} vozac={t.vozac} polazak={t.polazak} dolazak={t.dolazak} status={t.status} />
                    ))}

                </div>
            </div>
        </section>
    );
}

export default VozilaDetaljiPage