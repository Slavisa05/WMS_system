import { Boxes, LayoutGrid, Warehouse, PackageCheck, PackageOpen } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateSlot, deleteSlot } from "@/api/slot";
import Header from "@/components/Header";
import Button from "@/components/Button";
import useSlot from "@/hooks/useSlot";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import SlotForm from "@/components/forms/SlotForm";

const SlotPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { slot, isLoading, error, refetch } = useSlot(Number(id));

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { naziv: string, kapacitet: number }) => {
        if (!slot) return
        setIsSubmitting(true)
        try {
            await updateSlot(slot.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni slota')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!slot) return
        setIsSubmitting(true)
        try {
            await deleteSlot(slot.id)
            navigate(`/sektori/${slot.sektor.id}`)     
        } catch {
            alert('Greška pri brisanju slota')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const procenat = slot && slot.kapacitet > 0 ? Math.round((slot.zauzet_kapacitet / slot.kapacitet) * 100) : 0;

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji slota" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{slot?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>
                <p className="flex items-center gap-2"><LayoutGrid size={16} className="text-text-muted shrink-0" />Sektor: {slot?.sektor.naziv}</p>
                <p className="flex items-center gap-2"><Warehouse size={16} className="text-text-muted shrink-0" />Skladište: {slot?.sektor.skladiste.naziv}</p>
                <p className="flex items-center gap-2"><Boxes size={16} className="text-text-muted shrink-0" />Kapacitet: {slot?.kapacitet}</p>
                <p className="flex items-center gap-2"><PackageCheck size={16} className="text-text-muted shrink-0" />Zauzeto: {slot?.zauzet_kapacitet}</p>
                <p className="flex items-center gap-2"><PackageOpen size={16} className="text-text-muted shrink-0" />Slobodno: {slot?.slobodan_kapacitet}</p>

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

            <Modal isOpen={isEditOpen} title="Izmeni slot" onClose={() => setIsEditOpen(false)}>
                <SlotForm
                    initialData={slot}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši slot"
                message={`Da li ste sigurni da želite da izbrišete slot "${slot?.naziv}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />
        </section>
    );
}

export default SlotPage