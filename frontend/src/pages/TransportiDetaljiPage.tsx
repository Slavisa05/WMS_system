import { Truck, User, CalendarArrowUp, CalendarArrowDown, Activity, StickyNote } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { updateTransport } from "@/api/transport";
import { formatDatum } from "@/lib/utils";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";
import useTransport from "@/hooks/useTransport";
import useDokumenta from "@/hooks/useDokumenta";
import Modal from "@/components/Modal";
import TransportForm, { type TransportFormErrors } from "@/components/forms/TransportForm";

const TransportiDetaljiPage = () => {
    const { id } = useParams();
    const { transport, isLoading, error, refetch } = useTransport(Number(id));
    const { dokumenta } = useDokumenta();

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [transportErrors, setTransportErrors] = useState<TransportFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseTransportErrors = (err: any): TransportFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri izmeni transporta' }
        }

        const fieldErrors: TransportFormErrors = {
            vozac: getFirstErrorMessage(data.vozac),
            vozilo: getFirstErrorMessage(data.vozilo),
            datum_polaska: getFirstErrorMessage(data.datum_polaska),
            datum_zavrsetka: getFirstErrorMessage(data.datum_zavrsetka),
            status: getFirstErrorMessage(data.status),
            napomena: getFirstErrorMessage(data.napomena),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.vozac && !fieldErrors.vozilo && !fieldErrors.datum_polaska && !fieldErrors.datum_zavrsetka && !fieldErrors.status && !fieldErrors.napomena && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri izmeni transporta'
        }

        return fieldErrors
    }

    const handleEdit = async (data: { vozac: number, vozilo: number, datum_polaska: string, datum_zavrsetka: string | null, status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO', napomena: string | null }) => {
        if (!transport) return
        setIsSubmitting(true)
        setTransportErrors({})
        try {
            await updateTransport(transport.id, data)
            setIsEditOpen(false)
            refetch()
        } catch (err: any) {
            setTransportErrors(parseTransportErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const dokumentaTransporta = dokumenta.filter(d => d.transport?.id === transport?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Transport" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Transport #{transport?.id}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Truck size={16} className="text-text-muted shrink-0" />Vozilo: {transport?.vozilo.model} {transport?.vozilo.registarski_broj}</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Vozac: {transport?.vozac ? `${transport.vozac.ime} ${transport.vozac.prezime}` : '/'}</p>
                <p className="flex items-center gap-2"><CalendarArrowUp size={16} className="text-text-muted shrink-0" />Polazak: {formatDatum(transport?.datum_polaska)}</p>
                <p className="flex items-center gap-2"><CalendarArrowDown size={16} className="text-text-muted shrink-0" />Dolazak: {formatDatum(transport?.datum_zavrsetka)}</p>
                <p className="flex items-center gap-2"><Activity size={16} className="text-text-muted shrink-0" />Status: {transport?.status}</p>
                <p className="flex items-center gap-2"><StickyNote size={16} className="text-text-muted shrink-0" />Napomena: {transport?.napomena ?? '/'}</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Dokumenti ovog transporta</h2>
                <div className="flex flex-col gap-2">
                    {dokumentaTransporta.map(d => (
                        <DocumentLogItem key={d.id} {...d}  />
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isEditOpen}
                title="Izmeni transport"
                onClose={() => {
                    setTransportErrors({})
                    setIsEditOpen(false)
                }}
            >
                <TransportForm
                    initialData={transport}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setTransportErrors({})
                        setIsEditOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={transportErrors}
                />
            </Modal>
        </section>
    );
}

export default TransportiDetaljiPage