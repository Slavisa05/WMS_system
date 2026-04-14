import { Clock, Calendar, User, Building2, LogIn, LogOut, Truck } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom";
import { formatDatum } from "@/lib/utils";
import Header from "@/components/Header";
import Button from "@/components/Button";
import StavkeDokumenta from "@/components/StavkeDokumenta";
import useDokument from "@/hooks/useDokument";
import { posaljiDokument, odobriDokument, odbijDokument } from "@/api/dokument";
import { useAuth } from "@/context/AuthContext";

const DokumentaDetaljiPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isMenadzer } = useAuth();
    const { dokument, isLoading, error, refetch } = useDokument(Number(id));

    const isKreator = dokument?.zaposleni.user === user?.id;
    const mozeMenjati = isMenadzer || isKreator;

    const handlePosalji = async () => {
        await posaljiDokument(Number(id))
        refetch()
    }

    const handleOdobri = async () => {
        await odobriDokument(Number(id))
        refetch()
    }

    const handleOdbij = async () => {
        await odbijDokument(Number(id))
        refetch()
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;    

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Dokument" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{dokument?.tip} #{dokument?.id}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        {dokument?.status === 'NACRT' && mozeMenjati && <>
                            <Button text='izmeni' onClick={() => navigate(`/dokumenta/${id}/uredi_dokument`)} />
                            <Button text="pošalji" variant="secondary" onClick={handlePosalji} />
                        </>}
                        {dokument?.status === 'NA_CEKANJU' && isMenadzer && <>
                            <Button text="odobri" onClick={handleOdobri} />
                            <Button text="odbij" variant="secondary" onClick={handleOdbij} />
                        </>}
                    </div>
                </div>

                <p className="flex items-center gap-2"><Clock size={16} className="text-text-muted shrink-0" />Status: {dokument?.status}</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-text-muted shrink-0" />Datum i Vreme: {formatDatum(dokument?.datum_vreme)}</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Zaposleni: {dokument?.zaposleni.ime} {dokument?.zaposleni.prezime}</p>
                <p className="flex items-center gap-2"><Building2 size={16} className="text-text-muted shrink-0" />Poslovni partner: {dokument?.poslovni_partner?.naziv ?? '/'}</p>
                <p className="flex items-center gap-2"><LogIn size={16} className="text-text-muted shrink-0" />Skladiste ulaza: {dokument?.skladiste_ulaza?.naziv ?? '/'}</p>
                <p className="flex items-center gap-2"><LogOut size={16} className="text-text-muted shrink-0" />Skladiste izlaza: {dokument?.skladiste_izlaza?.naziv ?? '/'}</p>
                <p className="flex items-center gap-2">
                    <Truck size={16} className="text-text-muted shrink-0" />
                    Transport:{' '}
                    {dokument?.transport
                        ? <a href={`/transporti/${dokument.transport.id}`} className="text-primary hover:underline">#{dokument.transport.id}</a>
                        : '/'}
                </p>
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