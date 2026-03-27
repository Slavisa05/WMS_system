import { Hash, Mail, MapPin, Phone, Tag } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updatePartner, deletePartner } from "@/api/partner";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";
import usePartner from "@/hooks/usePartner";
import useDokumenta from "@/hooks/useDokumenta";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import PartnerForm from "@/components/forms/PartnerForm";

const PartneriDetaljiPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { partner, isLoading, error, refetch } = usePartner(Number(id))
    const { dokumenta } = useDokumenta()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { naziv: string }) => {
        if (!partner) return
        setIsSubmitting(true)
        try {
            await updatePartner(partner.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni partnera')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!partner) return
        setIsSubmitting(true)
        try {
            await deletePartner(partner.id)
            navigate('/partneri')     
        } catch {
            alert('Greška pri brisanju partnera')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const dokumentaPartnera = dokumenta.filter(d => d.poslovni_partner?.id === partner?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Poslovni Partner" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{partner?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />PIB: {partner?.pib}</p>
                <p className="flex items-center gap-2"><Mail size={16} className="text-text-muted shrink-0" />email: {partner?.email}</p>
                <p className="flex items-center gap-2"><MapPin size={16} className="text-text-muted shrink-0" />Adresa: {partner?.adresa}</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted shrink-0" />Telefon: {partner?.telefon}</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted shrink-0" />Tip: {partner?.tip}</p>
            </div>

            <div className="flex flex-col w-full gap-4">
                <h2>Dokumenti sa ovim partnerom</h2>
                
                {dokumentaPartnera.map(d => (
                    <DocumentLogItem key={d.id} {...d} />
                ))}
            </div>

            <Modal isOpen={isEditOpen} title="Izmeni kategoriju" onClose={() => setIsEditOpen(false)}>
                <PartnerForm
                    initialData={partner}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši partnera"
                message={`Da li ste sigurni da želite da izbrišete partnera "${partner?.naziv}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />
        </section>
    );
}

export default PartneriDetaljiPage