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
import useZaposlene from "@/hooks/useZaposlene";
import useSkladista from "@/hooks/useSkladista";
import useVozila from "@/hooks/useVozila";

const DashboardPage = () => {
    const { dokumenta } = useDokumenta();
    const { transporti } = useTransporti();
    const { proizvodi } = useProizvodi();
    const { zalihe } = useZalihe();
    const { zaposlene } = useZaposlene();
    const { skladista } = useSkladista();
    const { vozila } = useVozila();

    const poslednjiDokumenti = dokumenta.slice(-5).reverse();
    const poslednjiTransporti = transporti.slice(-5).reverse();
    const aktivniTransporti = transporti.filter(t => t.status === 'ZAKAZANO' || t.status === 'U_TOKU').length;
    const naCekanjuDokumenta = dokumenta.filter(d => d.status === 'NA_CEKANJU').length;
    const neuspesniTransporti = transporti.filter(t => t.status === 'NEUSPESNO').length;
    const today = new Date();
    const vozilaIsteklaReg = vozila.filter(v => new Date(v.datum_registracije) < today).length;

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading='Dashboard' />

            <div className="flex flex-col gap-2">
                {naCekanjuDokumenta > 0 && <Obavestenje link="/dokumenta" tekst={`${naCekanjuDokumenta} dokument${naCekanjuDokumenta === 1 ? '' : 'a'} čeka na odobrenje`} status="UPOZORENJE" />}
                {neuspesniTransporti > 0 && <Obavestenje link="/transporti" tekst={`${neuspesniTransporti} transport${neuspesniTransporti === 1 ? '' : 'a'} označen${neuspesniTransporti === 1 ? '' : 'o'} kao neuspešno`} status="KRITICNO" />}
                {vozilaIsteklaReg > 0 && <Obavestenje link="/vozila" tekst={`${vozilaIsteklaReg} vozil${vozilaIsteklaReg === 1 ? 'o' : 'a'} sa isteklom registracijom`} status="INFO" />}
            </div>

            <div className="flex flex-wrap gap-3 w-full">
                <KPICard title="Ukupno proizvoda u sistemu" value={proizvodi.length} icon={BadgeInfo} />
                <KPICard title="Ukupne zalihe" value={zalihe.length} icon={BadgeInfo} />
                <KPICard title="Aktivni transporti" value={aktivniTransporti} icon={BadgeInfo} />
                <KPICard title="Dokumenta na čekanju" value={naCekanjuDokumenta} icon={BadgeInfo} />
                <KPICard title="Broj aktivnih zaposlenih" value={zaposlene.length} icon={BadgeInfo} />
                <KPICard title="Broj skladišta" value={skladista.length} icon={BadgeInfo} />
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