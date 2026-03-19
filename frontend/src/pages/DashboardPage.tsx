import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import DocumentLogItem from "@/components/DocumentLogItem";
import TransportLogItem from "@/components/TransportLogItem";
import Obavestenje from "@/components/Obavestenje";
import { BadgeInfo } from "lucide-react";

const DashboardPage = () => {
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading='Dashboard' />

            <div className="flex flex-col gap-2">
                <Obavestenje link="https://google.com" tekst="3 dokumenta čeka na odobrenje" status="UPOZORENJE" />
                <Obavestenje link="https://google.com" tekst="2 transporta označena kao neuspešno" status="KRITICNO" />
                <Obavestenje link="https://google.com" tekst="4 vozila sa isteklom registracijom" status="INFO" />
            </div>

            <div className="flex flex-wrap gap-3 w-full">
                <KPICard title="Ukupno proizvoda u sistemu" value="142" icon={BadgeInfo} trend={{ value: 12, direction: 'up' }} />
                <KPICard title="Ukupne zalihe" value="38" icon={BadgeInfo} trend={{ value: 5, direction: 'down' }} />
                <KPICard title="Aktivni transporti" value="21" icon={BadgeInfo} />
                <KPICard title="Dokumenta na čekanju" value="14" icon={BadgeInfo} />
                <KPICard title="Broj aktivnih zaposlenih" value="12" icon={BadgeInfo} />
                <KPICard title="Broj skladišta" value="3" icon={BadgeInfo} />
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="w-full rounded-xl flex flex-col gap-2">
                    <h2>Poslednji dokumenti</h2>
                    <DocumentLogItem id={1234} tip="PRIJEMNICA" datumVreme="11/03/2026 12:25:30h" status="ODOBREN" zaposleni="Marko Markovic" />
                    <DocumentLogItem id={2245} tip="POVRATNICA_K" datumVreme="19/10/2025 19:00:00h" status="NA_CEKANJU" zaposleni="Mirko Mirkovic" />
                    <DocumentLogItem id={1745} tip="PRENOS" datumVreme="17/11/2025 15:00:00h" status="ODBIJEN" zaposleni="Filip Filipovic" />
                    <DocumentLogItem id={1458} tip="PRIJEMNICA" datumVreme="17/11/2025 15:00:00h" status="ODOBREN" zaposleni="Filip Filipovic" />
                    <DocumentLogItem id={3154} tip="POVRATNICA_K" datumVreme="17/11/2025 15:00:00h" status="ODBIJEN" zaposleni="Filip Filipovic" poslovniPartner="Idea" />
                </div>

                <div className="w-full rounded-xl flex flex-col gap-2">
                    <h2>Poslednji transporti</h2>
                    <TransportLogItem id={1} vozilo={{model: 'VW Crafter', registarskiBroj: 'BG-1234-BG'}} vozac="Mirko Mirkovic" polazak="08:00" status="ZAKAZANO" />
                    <TransportLogItem id={2} vozilo={{model: 'Mercedes Sprinter', registarskiBroj: 'BG-4321-BG'}} vozac="Marko MArkovic" polazak="09:00" status="U_TOKU" />
                    <TransportLogItem id={3} vozilo={{model: 'Ford Transit', registarskiBroj: 'BG-4324-GB'}} vozac="Filip Filipovic" polazak="10:00" status="ZAVRSENO" />
                    <TransportLogItem id={4} vozilo={{model: 'Iveco Daily', registarskiBroj: 'BG-7654-SD'}} vozac="Mirko Mirkovic" polazak="11:00" status="OTKAZANO" />
                    <TransportLogItem id={5} vozilo={{model: 'Renault Master', registarskiBroj: 'BG-5234-AG'}} vozac="Marko MArkovic" polazak="12:00" status="NEUSPESNO" />
                </div>
            </div>
        </section>
    );
}

export default DashboardPage