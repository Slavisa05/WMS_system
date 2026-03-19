import { Hash, Phone, CalendarPlus, CalendarCheck, Briefcase, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TransportLogItem from "@/components/TransportLogItem";

interface Zaposleni {
    id: number;
    ime: string;
    prezime: string;
    jmbg: string;
    brojTelefona: string;
    datumZaposlenja: string;
    ugovorDo: string;
    pozicija: 'Zaposleni' | 'Menadzer' | 'Admin';
}

const ZaposleniDetaljiPage = () => {
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Zaposlen" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Mirko Mirkovic</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />JMBG: 1910005770024</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted shrink-0" />Broj telefona: 0640811782</p>
                <p className="flex items-center gap-2"><CalendarPlus size={16} className="text-text-muted shrink-0" />Datum zaposlenja: 19/05/2024</p>
                <p className="flex items-center gap-2"><CalendarCheck size={16} className="text-text-muted shrink-0" />Ugovor do: /</p>
                <p className="flex items-center gap-2"><Briefcase size={16} className="text-text-muted shrink-0" />Pozicija: Zaposleni</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Zaduzena Vozila</h2>
                <Link className="w-[50%]" to={`/vozila/1`}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                        <strong>VW Crafter</strong>
                        <p>BG-1234-BG</p>
                        <ChevronRight />
                    </div>
                </Link>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Transporti</h2>
                <TransportLogItem id={1} vozilo={{model: 'VW Crafter', registarskiBroj: 'BG-1234-BG'}} vozac="Mirko Mirkovic" polazak="08:00" status="ZAKAZANO" />
            </div>
        </section>
    );
}

export default ZaposleniDetaljiPage