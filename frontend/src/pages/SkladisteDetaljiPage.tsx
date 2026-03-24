import { useParams } from 'react-router-dom'
import { Plus, MapPin, Tag, Boxes, PackageCheck, PackageOpen, Phone } from "lucide-react";
import Header from '@/components/Header'
import Button from '@/components/Button'
import SektorCard from '@/components/SektorCard'
import useSkladiste from '@/hooks/useSkladiste';
import useSektore from '@/hooks/useSektore';
import useSlotovi from '@/hooks/useSlotovi';

const SkladisteDetaljiPage = () => {
    const { id } = useParams();
    const { skladiste, isLoading, error } = useSkladiste(Number(id));
    const { sektori } = useSektore();
    const { slotovi } = useSlotovi();

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const sektoriSkladista = sektori.filter(s => s.skladiste.id === skladiste?.id);

    const slotoviSkladista = slotovi.filter(sl => sektoriSkladista.some(s => s.id === sl.sektor.id));
    const kapacitet = slotoviSkladista.reduce((sum, sl) => sum + sl.kapacitet, 0);
    const zauzeto = slotoviSkladista.reduce((sum, sl) => sum + sl.zauzet_kapacitet, 0);
    const slobodno = kapacitet - zauzeto;
    const procenat = kapacitet > 0 ? Math.round((zauzeto / kapacitet) * 100) : 0;

    return (
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji skladišta" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Veleprodajno skladiste</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><MapPin size={16} className="text-text-muted" />Adresa: {skladiste?.adresa}</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted" />Telefon: {skladiste?.telefon}</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted" />Tip: {skladiste?.tip}</p>
                <p className="flex items-center gap-2"><Boxes size={16} className="text-text-muted" />Kapacitet: {kapacitet}</p>
                <p className="flex items-center gap-2"><PackageCheck size={16} className="text-text-muted shrink-0" />Zauzeto: {zauzeto}</p>
                <p className="flex items-center gap-2"><PackageOpen size={16} className="text-text-muted shrink-0" />Slobodno: {slobodno}</p>
            
                <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Popunjenost</span>
                        <span>{procenat}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-background overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${procenat}%`,
                                backgroundColor: procenat >= 90 ? '#ef4444' : procenat >= 60 ? '#f97316' : '#22c55e'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 items-center justify-between w-full">
                    <h2>Sektori</h2> 
                    <div className="flex items-center gap-2 px-8 py-4 rounded-xl bg-sidebar">
                        <Button icon={Plus} text='dodaj sektor' />
                    </div>
                </div>

                <div className="sm:w-[50%] w-[90%] flex flex-col gap-4">
                    {sektoriSkladista.map(s => (
                        <SektorCard key={s.id} {...s} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SkladisteDetaljiPage
