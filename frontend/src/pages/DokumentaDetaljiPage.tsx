import { Clock, Calendar, User, Building2, LogIn, LogOut, Truck } from "lucide-react"
import { useState } from "react";
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
    const [akcijaError, setAkcijaError] = useState<string | null>(null)
    const [akcijaUToku, setAkcijaUToku] = useState<'posalji' | 'odobri' | 'odbij' | null>(null)

    const isKreator = dokument?.zaposleni.user === user?.id;
    const mozeMenjati = isMenadzer || isKreator;

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (typeof value === 'string' && value.trim().length > 0) return value

        if (Array.isArray(value)) {
            for (const item of value) {
                const nestedMessage = getFirstErrorMessage(item)
                if (nestedMessage) return nestedMessage
            }
            return undefined
        }

        if (value && typeof value === 'object') {
            const entries = Object.values(value as Record<string, unknown>)
            for (const nestedValue of entries) {
                const nestedMessage = getFirstErrorMessage(nestedValue)
                if (nestedMessage) return nestedMessage
            }
        }

        return undefined
    }

    const getApiErrorMessage = (err: unknown, fallback: string): string => {
        const errorObj = err as { response?: { data?: unknown }; message?: string }
        const data = errorObj?.response?.data

        return (
            getFirstErrorMessage((data as { detail?: unknown } | undefined)?.detail) ||
            getFirstErrorMessage((data as { non_field_errors?: unknown } | undefined)?.non_field_errors) ||
            getFirstErrorMessage(data) ||
            errorObj?.message ||
            fallback
        )
    }

    const handlePosalji = async () => {
        setAkcijaError(null)
        setAkcijaUToku('posalji')
        try {
            await posaljiDokument(Number(id))
            await refetch()
        } catch (err) {
            setAkcijaError(getApiErrorMessage(err, 'Greška pri slanju dokumenta'))
        } finally {
            setAkcijaUToku(null)
        }
    }

    const handleOdobri = async () => {
        setAkcijaError(null)
        setAkcijaUToku('odobri')
        try {
            await odobriDokument(Number(id))
            await refetch()
        } catch (err) {
            setAkcijaError(getApiErrorMessage(err, 'Greška pri odobravanju dokumenta'))
        } finally {
            setAkcijaUToku(null)
        }
    }

    const handleOdbij = async () => {
        setAkcijaError(null)
        setAkcijaUToku('odbij')
        try {
            await odbijDokument(Number(id))
            await refetch()
        } catch (err) {
            setAkcijaError(getApiErrorMessage(err, 'Greška pri odbijanju dokumenta'))
        } finally {
            setAkcijaUToku(null)
        }
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
                            <Button text="pošalji" variant="secondary" onClick={handlePosalji} isLoading={akcijaUToku === 'posalji'} />
                        </>}
                        {dokument?.status === 'NA_CEKANJU' && isMenadzer && <>
                            <Button text="odobri" onClick={handleOdobri} isLoading={akcijaUToku === 'odobri'} />
                            <Button text="odbij" variant="secondary" onClick={handleOdbij} isLoading={akcijaUToku === 'odbij'} />
                        </>}
                    </div>
                </div>
                {akcijaError && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{akcijaError}</p>
                )}

                <p className="flex items-center gap-2"><Clock size={16} className="text-text-muted shrink-0" />Status: {dokument?.status}</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-text-muted shrink-0" />Datum i Vreme: {formatDatum(dokument?.datum_vreme)}</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Zaposleni: {dokument?.zaposleni.ime} {dokument?.zaposleni.prezime}</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Odobrio: {dokument?.odobrio ? `${dokument.odobrio.ime} ${dokument.odobrio.prezime}` : '/'}</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-text-muted shrink-0" />Datum odluke: {formatDatum(dokument?.datum_odluke)}</p>
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