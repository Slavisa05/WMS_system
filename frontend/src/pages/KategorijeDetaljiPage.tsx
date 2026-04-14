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
import KategorijaForm, { type KategorijaFormErrors } from "@/components/forms/KategorijaForm";

const KategorijeDetaljiPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { kategorija, isLoading, error, refetch } = useKategorija(Number(id))
    const { proizvodi } = useProizvode()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [kategorijaErrors, setKategorijaErrors] = useState<KategorijaFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseKategorijaErrors = (err: any): KategorijaFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri izmeni kategorije' }
        }

        const fieldErrors: KategorijaFormErrors = {
            naziv: getFirstErrorMessage(data.naziv),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri izmeni kategorije'
        }

        return fieldErrors
    }

    const handleEdit = async (data: { naziv: string }) => {
        if (!kategorija) return
        setIsSubmitting(true)
            setKategorijaErrors({})
        try {
            await updateKategorija(kategorija.id, data)
            setIsEditOpen(false)
            refetch()
        } catch (err: any) {
            setKategorijaErrors(parseKategorijaErrors(err))
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
                <h2>Proizvodi</h2> 

                <div className="flex flex-wrap gap-4">
                    {proizvodiKategorije.map(p => (
                        <ProizvodCard key={p.id} {...p} />
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isEditOpen}
                title="Izmeni kategoriju"
                onClose={() => {
                    setKategorijaErrors({})
                    setIsEditOpen(false)
                }}
            >
                <KategorijaForm
                    initialData={kategorija}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setKategorijaErrors({})
                        setIsEditOpen(false)
                    }}
                    isLoading={isSubmitting}
                                    errors={kategorijaErrors}
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