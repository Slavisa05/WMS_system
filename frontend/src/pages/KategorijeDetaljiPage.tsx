import { Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateKategorija, deleteKategorija } from "@/api/kategorija";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";
import useKategorija from "@/hooks/useKategorija";
import useProizvode from "@/hooks/useProizvode";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import KategorijaForm from "@/components/forms/KategorijaForm";

const KategorijeDetaljiPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { kategorija, isLoading, error, refetch } = useKategorija(Number(id))
    const { proizvodi } = useProizvode()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { naziv: string }) => {
        if (!kategorija) return
        setIsSubmitting(true)
        try {
            await updateKategorija(kategorija.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni kategorije')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!kategorija) return
        setIsSubmitting(true)
        try {
            await deleteKategorija(kategorija.id)
            navigate('/kategorije')     
        } catch {
            alert('Greška pri brisanju kategorije')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const proizvodiKategorije = proizvodi.filter(p => p.kategorija.id === Number(id))

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Kategorija stranica" />

            <div className="flex flex-wrap pl-4 gap-8 justify-between items-center w-full bg-sidebar text-sidebar-text rounded-xl">
                <h2>{kategorija?.naziv}</h2>
                <div className="flex items-center gap-2 py-4 px-8 rounded-xl">
                    <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                    <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-8 px-4 py-2 items-center justify-between w-full bg-sidebar text-sidebar-text rounded-xl">
                    <h2>Proizvodi</h2> 
                    <div className="flex items-center gap-2 px-8 py-4 rounded-xl bg-sidebar">
                        <Button icon={Plus} text='dodaj proizvod' />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    {proizvodiKategorije.map(p => (
                        <ProizvodCard key={p.id} {...p} />
                    ))}
                </div>
            </div>

            <Modal isOpen={isEditOpen} title="Izmeni kategoriju" onClose={() => setIsEditOpen(false)}>
                <KategorijaForm
                    initialData={kategorija}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši kategoriju"
                message={`Da li ste sigurni da želite da izbrišete kategoriju "${kategorija?.naziv}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />
        </section>
    );
}

export default KategorijeDetaljiPage