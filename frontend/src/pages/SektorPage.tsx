import { useParams, useNavigate } from "react-router-dom";
import { Plus, Warehouse, Boxes, PackageCheck, PackageOpen } from "lucide-react";
import { useState } from "react";
import { updateSektor, deleteSektor } from "@/api/sektor";
import { createSlot } from "@/api/slot";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SlotCard from "@/components/SlotCard";
import useSektor from "@/hooks/useSektor";
import useSlotovi from "@/hooks/useSlotovi";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import SektorForm from "@/components/forms/SektorForm";
import SlotForm from "@/components/forms/SlotForm";

const SektorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { sektor, isLoading, error, refetch } = useSektor(Number(id));
    const { slotovi, refetch: refetchSlotove } = useSlotovi();

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { naziv: string }) => {
        if (!sektor) return
        setIsSubmitting(true)
        try {
            await updateSektor(sektor.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni sektora')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!sektor) return
        setIsSubmitting(true)
        try {
            await deleteSektor(sektor.id)
            navigate(`/skladista/${sektor.skladiste.id}`)     
        } catch {
            alert('Greška pri brisanju sektora')
        } finally {
            setIsSubmitting(false)
        }
    }

    // DODAVANJE SLOTA
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false)
    const [isSubmittingSlot, setIsSubmittingSlot] = useState(false)

    const handleAdd = async (data: { naziv: string, kapacitet: number }) => {
        setIsSubmittingSlot(true)
        try {
            await createSlot({ ...data, sektor: sektor!.id })
            setIsAddSlotOpen(false)
            refetchSlotove()
        } catch {
            alert('Greška pri dodavanju sektora')
        } finally {
            setIsSubmittingSlot(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const slotoviSektora = slotovi.filter(s => s.sektor.id === sektor?.id);

    const kapacitet = slotoviSektora.reduce((sum, sl) => sum + sl.kapacitet, 0);
    const zauzeto = slotoviSektora.reduce((sum, sl) => sum + sl.zauzet_kapacitet, 0);
    const slobodno = kapacitet - zauzeto;
    const procenat = kapacitet > 0 ? Math.round((zauzeto / kapacitet) * 100) : 0;

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading={'Detalji sektora'} />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{sektor?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Warehouse size={16} className="text-text-muted shrink-0" />Skladište: {sektor?.skladiste.naziv}</p>
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
                    <h2>Slotovi</h2> 
                    <div className="flex items-center gap-2 px-8 py-4 rounded-xl bg-sidebar">
                        <Button icon={Plus} text='dodaj slot' onClick={() => setIsAddSlotOpen(true)} />
                    </div>
                </div>

                <div className="sm:w-[50%] w-[90%] flex flex-col gap-4">
                    {slotoviSektora.map(sl => (
                        <SlotCard key={sl.id} {...sl} />
                    ))}
                </div>
            </div>

            <Modal isOpen={isEditOpen} title="Izmeni sektor" onClose={() => setIsEditOpen(false)}>
                <SektorForm
                    initialData={sektor}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši sektor"
                message={`Da li ste sigurni da želite da izbrišete sektor "${sektor?.naziv}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />

            <Modal isOpen={isAddSlotOpen} title="Dodaj slot" onClose={() => setIsAddSlotOpen(false)}>
                <SlotForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddSlotOpen(false)}
                    isLoading={isSubmittingSlot}
                />
            </Modal>
        </section>
    );
}

export default SektorPage