import { Hash, Phone, CalendarPlus, CalendarCheck, Briefcase, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TransportLogItem from "@/components/TransportLogItem";
import useZaposleni from "@/hooks/useZaposleni";
import useVozila from "@/hooks/useVozila";
import useTransporti from "@/hooks/useTransporti";

const ZaposleniDetaljiPage = () => {
    const { id } = useParams();
    const { zaposleni, isLoading, error } = useZaposleni(Number(id));
    const { vozila } = useVozila();
    const { transporti } = useTransporti();

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const vozilaZaposlenog = vozila.filter(v => v.zaduzeni_vozac.id === zaposleni?.id);
    const transportiZaposlenog = transporti.filter(t => t.vozac?.id === zaposleni?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji zaposlenog" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{zaposleni?.ime} {zaposleni?.prezime}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />JMBG: {zaposleni?.jmbg}</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted shrink-0" />Broj telefona: {zaposleni?.broj_telefona}</p>
                <p className="flex items-center gap-2"><CalendarPlus size={16} className="text-text-muted shrink-0" />Datum zaposlenja: {zaposleni?.datum_zaposlenja}</p>
                <p className="flex items-center gap-2"><CalendarCheck size={16} className="text-text-muted shrink-0" />Ugovor do: {zaposleni?.ugovor_do ?? '/'}</p>
                <p className="flex items-center gap-2"><Briefcase size={16} className="text-text-muted shrink-0" />Pozicija: {zaposleni?.pozicija?.naziv}</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Zaduzena Vozila</h2>
                {vozilaZaposlenog.map(v => (
                    <Link key={v.id} className="w-[50%]" to={`/vozila/${v.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                            <strong>{v.model}</strong>
                            <p>{v.registarski_broj}</p>
                            <ChevronRight />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <h2>Transporti</h2>
                {transportiZaposlenog.map(t => (
                    <TransportLogItem key={t.id} {...t} />
                ))}
            </div>
        </section>
    );
}

export default ZaposleniDetaljiPage