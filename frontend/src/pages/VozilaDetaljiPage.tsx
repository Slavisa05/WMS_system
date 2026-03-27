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
import VoziloForm from "@/components/forms/VoziloForm";

const VozilaDetaljiPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { vozilo, isLoading, error, refetch } = useVozilo(Number(id))
    const { transporti } = useTransporti()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { model: string, registarski_broj: string, datum_registracije: string, poslednji_tehnicki: string, zaduzeni_vozac: number }) => {
        if (!vozilo) return
        setIsSubmitting(true)
        try {
            await updateVozilo(vozilo.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni vozila')
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

            <Modal isOpen={isEditOpen} title="Izmeni vozilo" onClose={() => setIsEditOpen(false)}>
                <VoziloForm
                    initialData={vozilo}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
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