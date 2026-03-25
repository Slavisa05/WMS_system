import { Clock, Calendar, User, Building2, LogIn, LogOut, Truck } from "lucide-react"
import { useParams } from "react-router-dom";
import { formatDatum } from "@/lib/utils";
import Header from "@/components/Header";
import Button from "@/components/Button";
import StavkeDokumenta from "@/components/StavkeDokumenta";
import useDokument from "@/hooks/useDokument";

const DokumentaDetaljiPage = () => {
    const { id } = useParams();
    const { dokument, isLoading, error } = useDokument(Number(id));

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;    

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Dokument" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{dokument?.tip} #{dokument?.id}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='prihvati' />
                        <Button text='odbij' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Clock size={16} className="text-text-muted shrink-0" />Status: {dokument?.status}</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-text-muted shrink-0" />Datum i Vreme: {formatDatum(dokument?.datum_vreme)}</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Zaposleni: {dokument?.zaposleni.ime} {dokument?.zaposleni.prezime}</p>
                <p className="flex items-center gap-2"><Building2 size={16} className="text-text-muted shrink-0" />Poslovni partner: {dokument?.poslovni_partner?.naziv ?? '/'}</p>
                <p className="flex items-center gap-2"><LogIn size={16} className="text-text-muted shrink-0" />Skladiste ulaza: {dokument?.skladiste_ulaza?.naziv ?? '/'}</p>
                <p className="flex items-center gap-2"><LogOut size={16} className="text-text-muted shrink-0" />Skladiste izlaza: {dokument?.skladiste_izlaza?.naziv ?? '/'}</p>
                <p className="flex items-center gap-2"><Truck size={16} className="text-text-muted shrink-0" />ID Transporta: {dokument?.transport?.id ?? '/'}</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Stavke Dokumenta</h2>
                <div className="flex flex-wrap gap-2">
                    {dokument?.stavke?.map(s => (
                        <StavkeDokumenta key={s.id} {...s} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default DokumentaDetaljiPage