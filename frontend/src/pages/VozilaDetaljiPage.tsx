import { Hash, CalendarCheck, Wrench, User } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateVozilo, deleteVozilo } from "@/api/vozilo";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TransportLogItem from "@/components/TransportLogItem";
import useVozilo from "@/hooks/useVozilo";
import useTransporti from "@/hooks/useTransporti";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import VoziloForm, { type VoziloFormErrors } from "@/components/forms/VoziloForm";

const VozilaDetaljiPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { vozilo, isLoading, error, refetch } = useVozilo(Number(id))
    const { transporti } = useTransporti()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [voziloErrors, setVoziloErrors] = useState<VoziloFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseVoziloErrors = (err: any): VoziloFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri izmeni vozila' }
        }

        const fieldErrors: VoziloFormErrors = {
            model: getFirstErrorMessage(data.model),
            registarski_broj: getFirstErrorMessage(data.registarski_broj),
            datum_registracije: getFirstErrorMessage(data.datum_registracije),
            poslednji_tehnicki: getFirstErrorMessage(data.poslednji_tehnicki),
            zaduzeni_vozac: getFirstErrorMessage(data.zaduzeni_vozac),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.model && !fieldErrors.registarski_broj && !fieldErrors.datum_registracije && !fieldErrors.poslednji_tehnicki && !fieldErrors.zaduzeni_vozac && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri izmeni vozila'
        }

        return fieldErrors
    }

    const handleEdit = async (data: { model: string, registarski_broj: string, datum_registracije: string, poslednji_tehnicki: string, zaduzeni_vozac: number }) => {
        if (!vozilo) return
        setIsSubmitting(true)
        setVoziloErrors({})
        try {
            await updateVozilo(vozilo.id, data)
            setIsEditOpen(false)
            refetch()
        } catch (err: any) {
            setVoziloErrors(parseVoziloErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!vozilo) return
        setIsSubmitting(true)
        try {
            await deleteVozilo(vozilo.id)
            navigate(`/vozila`)     
        } catch {
            alert('Greška pri brisanju vozila')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const transportiVozila = transporti.filter(t => t.vozilo.id === vozilo?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Vozilo" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{vozilo?.model}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />Registarski broj: {vozilo?.registarski_broj}</p>
                <p className="flex items-center gap-2"><CalendarCheck size={14} className="text-text-muted shrink-0" />Datum registracije: {vozilo?.datum_registracije}</p>
                <p className="flex items-center gap-2"><Wrench size={14} className="text-text-muted shrink-0" />Poslednji tehnicki: {vozilo?.poslednji_tehnicki}</p>
                <p className="flex items-center gap-2"><User size={14} className="text-text-muted shrink-0" />Zaduzeni vozac: {vozilo?.zaduzeni_vozac.ime} {vozilo?.zaduzeni_vozac.prezime}</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Transporti ovog vozila</h2>
                <div className="flex flex-col w-full gap-2">
                    {transportiVozila.map(t => (
                        <TransportLogItem key={t.id} {...t} />
                    ))}

                </div>
            </div>

            <Modal
                isOpen={isEditOpen}
                title="Izmeni vozilo"
                onClose={() => {
                    setVoziloErrors({})
                    setIsEditOpen(false)
                }}
            >
                <VoziloForm
                    initialData={vozilo}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setVoziloErrors({})
                        setIsEditOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={voziloErrors}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši vozilo"
                message={`Da li ste sigurni da želite da izbrišete vozilo "${vozilo?.model}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />
        </section>
    );
}

export default VozilaDetaljiPage