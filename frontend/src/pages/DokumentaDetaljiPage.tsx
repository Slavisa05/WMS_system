import { Clock, Calendar, User, Building2, LogIn, LogOut, Truck } from "lucide-react"
import Header from "@/components/Header";
import Button from "@/components/Button";
import StavkeDokumenta from "@/components/StavkeDokumenta";

interface StavkaDokumenta {
    id: number;
    proizvod: string;
    slotUlaza: string;
    slotIzlaza: string;
    kolicina: number;
    jedinicaMere: string;
    cena: number;
}

const DokumentaDetaljiPage = () => {
    const stavke: StavkaDokumenta[] = [
        { id: 1, proizvod: 'Coca Cola 330ml', slotUlaza: 'Slot A1', slotIzlaza: '—', kolicina: 150, jedinicaMere: 'kom', cena: 50 },
        { id: 2, proizvod: 'Pepsi 500ml', slotUlaza: 'Slot A2', slotIzlaza: '—', kolicina: 200, jedinicaMere: 'kom', cena: 45 },
        { id: 3, proizvod: 'Pepsi 500ml', slotUlaza: 'Slot A2', slotIzlaza: '—', kolicina: 200, jedinicaMere: 'kom', cena: 45 },
    ];

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Dokument" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Prijemnica #1452</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='prihvati' />
                        <Button text='odbij' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Clock size={16} className="text-text-muted shrink-0" />Status: NA CEKANJU</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-text-muted shrink-0" />Datum i Vreme: 17/03/2026 14:30h</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Zaposleni: Marko Markovic</p>
                <p className="flex items-center gap-2"><Building2 size={16} className="text-text-muted shrink-0" />Poslovni partner: IDEA</p>
                <p className="flex items-center gap-2"><LogIn size={16} className="text-text-muted shrink-0" />Skladiste ulaza: Veleprodajno skladiste</p>
                <p className="flex items-center gap-2"><LogOut size={16} className="text-text-muted shrink-0" />Skladiste izlaza: /</p>
                <p className="flex items-center gap-2"><Truck size={16} className="text-text-muted shrink-0" />Transport: /</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Stavke Dokumenta</h2>
                <div className="flex flex-wrap gap-2">
                    {stavke.map(s => {
                        return(
                            <StavkeDokumenta key={s.id} proizvod={s.proizvod} slotUlaza={s.slotUlaza} slotIzlaza={s.slotIzlaza} kolicina={s.kolicina} jedinicaMere={s.jedinicaMere} cena={s.cena} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default DokumentaDetaljiPage