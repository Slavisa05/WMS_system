import { Barcode, Hash, Ruler, Tag, Package, Lock, PackageOpen } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { updateProizvod, deleteProizvod } from "@/api/proizvod"
import Header from "@/components/Header"
import Button from "@/components/Button"
import ZalihePoSlotovima from "@/components/ZalihePoSlotovima"
import useProizvod from "@/hooks/useProizvod"
import useZalihe from "@/hooks/useZalihe"
import Modal from "@/components/Modal"
import ConfirmModal from "@/components/ConfirmModal"
import ProizvodForm from "@/components/forms/ProizvodForm"

const ProizvodiDetaljiPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { proizvod, isLoading, error, refetch } = useProizvod(Number(id));
    const { zalihe } = useZalihe();

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { naziv: string, barkod: string, sifra: string, jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol', kategorija: number }) => {
        if (!proizvod) return
        setIsSubmitting(true)
        try {
            await updateProizvod(proizvod.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni proizvoda')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!proizvod) return
        setIsSubmitting(true)
        try {
            await deleteProizvod(proizvod.id)
            navigate(`/proizvodi`)     
        } catch {
            alert('Greška pri brisanju proizvoda')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;
    
    const zaliheProizvoda = zalihe.filter(z => z.proizvod.id === proizvod?.id);

    const ukupno = zaliheProizvoda.reduce((sum, z) => sum + Number(z.kolicina), 0);
    const rezervisano = zaliheProizvoda.reduce((sum, z) => sum + Number(z.rezervisana_kolicina), 0);
    const dostupno = zaliheProizvoda.reduce((sum, z) => sum + Number(z.dostupna_kolicina), 0);

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji proizvoda" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{proizvod?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Barcode size={16} className="text-text-muted shrink-0" />Barkod: {proizvod?.barkod}</p>
                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />Šifra: {proizvod?.sifra}</p>
                <p className="flex items-center gap-2"><Ruler size={16} className="text-text-muted shrink-0" />Jedinica mere: {proizvod?.jedinica_mere}</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted shrink-0" />Kategorija: {proizvod?.kategorija.naziv}</p>
            </div>

            <div className="flex flex-col gap-6">
                <h2>Zalihe po slotovima:</h2>
                <div className="flex flex-wrap gap-4">
                    {zaliheProizvoda.map(z => (
                        <ZalihePoSlotovima key={1} {...z} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <h2>Ukupne zalihe</h2>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <p className="flex items-center gap-2"><Package size={14} className="text-text-muted shrink-0" />Ukupno: {ukupno}</p>
                    <p className="flex items-center gap-2"><Lock size={14} className="text-text-muted shrink-0" />Rezervisano: {rezervisano}</p>
                    <p className="flex items-center gap-2"><PackageOpen size={14} className="text-text-muted shrink-0" />Dostupno: {dostupno}</p>
                </div>
            </div>

            <Modal isOpen={isEditOpen} title="Izmeni proizvod" onClose={() => setIsEditOpen(false)}>
                <ProizvodForm
                    initialData={proizvod}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši proizvod"
                message={`Da li ste sigurni da želite da izbrišete proizvod "${proizvod?.naziv}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />
        </section>
    );
}

export default ProizvodiDetaljiPage