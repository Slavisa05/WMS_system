import { Hash, CalendarCheck, Wrench, User } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TransportLogItem from "@/components/TransportLogItem";
import useVozilo from "@/hooks/useVozilo";
import useTransporti from "@/hooks/useTransporti";

const VozilaDetaljiPage = () => {
    const { id } = useParams()
    const { vozilo, isLoading, error } = useVozilo(Number(id))
    const { transporti } = useTransporti()
    
    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const transportiVozila = transporti.filter(t => t.vozilo.id === vozilo?.id)

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
                    {transportiVozila.map(t => (
                        <TransportLogItem key={t.id} {...t} />
                    ))}

                </div>
            </div>
        </section>
    );
}

export default VozilaDetaljiPage