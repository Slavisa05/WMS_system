import { Truck, User, CalendarArrowUp, CalendarArrowDown, Activity, StickyNote } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";
import useTransport from "@/hooks/useTransport";
import useDokumenta from "@/hooks/useDokumenta";

const TransportiDetaljiPage = () => {
    const { id } = useParams();
    const { transport, isLoading, error } = useTransport(Number(id));
    const { dokumenta } = useDokumenta();

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const dokumentaTransporta = dokumenta.filter(d => d.transport?.id === transport?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Transport" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Transport #{transport?.id}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Truck size={16} className="text-text-muted shrink-0" />Vozilo: {transport?.vozilo.model} {transport?.vozilo.registarski_broj}</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Vozac: {transport?.vozac ? `${transport.vozac.ime} ${transport.vozac.prezime}` : '/'}</p>
                <p className="flex items-center gap-2"><CalendarArrowUp size={16} className="text-text-muted shrink-0" />Polazak: {transport?.datum_polaska}</p>
                <p className="flex items-center gap-2"><CalendarArrowDown size={16} className="text-text-muted shrink-0" />Dolazak: {transport?.datum_zavrsetka ?? '/'}</p>
                <p className="flex items-center gap-2"><Activity size={16} className="text-text-muted shrink-0" />Status: {transport?.status}</p>
                <p className="flex items-center gap-2"><StickyNote size={16} className="text-text-muted shrink-0" />Napomena: {transport?.napomena ?? '/'}</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Dokumenti ovog transporta</h2>
                <div className="flex flex-col gap-2">
                    {dokumentaTransporta.map(d => (
                        <DocumentLogItem key={d.id} {...d}  />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TransportiDetaljiPage