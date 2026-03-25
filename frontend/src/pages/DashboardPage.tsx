import { BadgeInfo } from "lucide-react";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";
import DocumentLogItem from "@/components/DocumentLogItem";
import TransportLogItem from "@/components/TransportLogItem";
import Obavestenje from "@/components/Obavestenje";
import useTransporti from "@/hooks/useTransporti";
import useDokumenta from "@/hooks/useDokumenta";
import useProizvodi from "@/hooks/useProizvode";
import useZalihe from "@/hooks/useZalihe";

const DashboardPage = () => {
    const { dokumenta } = useDokumenta();
    const { transporti } = useTransporti();
    const { proizvodi } = useProizvodi();
    const { zalihe } = useZalihe();

    const poslednjiDokumenti = dokumenta.slice(-5).reverse();
    const poslednjiTransporti = transporti.slice(-5).reverse();
    const aktivniTransporti = transporti.filter(t => t.status === 'ZAKAZANO' || t.status === 'U_TOKU').length;

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading='Dashboard' />

            <div className="flex flex-col gap-2">
                <Obavestenje link="https://google.com" tekst="3 dokumenta čeka na odobrenje" status="UPOZORENJE" />
                <Obavestenje link="https://google.com" tekst="2 transporta označena kao neuspešno" status="KRITICNO" />
                <Obavestenje link="https://google.com" tekst="4 vozila sa isteklom registracijom" status="INFO" />
            </div>

            <div className="flex flex-wrap gap-3 w-full">
                <KPICard title="Ukupno proizvoda u sistemu" value={proizvodi.length} icon={BadgeInfo} />
                <KPICard title="Ukupne zalihe" value={zalihe.length} icon={BadgeInfo} />
                <KPICard title="Aktivni transporti" value={aktivniTransporti} icon={BadgeInfo} />
                <KPICard title="Dokumenta na čekanju" value={14} icon={BadgeInfo} />
                <KPICard title="Broj aktivnih zaposlenih" value={12} icon={BadgeInfo} />
                <KPICard title="Broj skladišta" value={3} icon={BadgeInfo} />
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="w-full rounded-xl flex flex-col gap-2">
                    <h2>Poslednji dokumenti</h2>
                    {poslednjiDokumenti.map(d => (
                        <DocumentLogItem key={d.id} {...d} />
                    ))}
                </div>

                <div className="w-full rounded-xl flex flex-col gap-2">
                    <h2>Poslednji transporti</h2>
                    {poslednjiTransporti.map(t => (
                        <TransportLogItem key={t.id} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default DashboardPage