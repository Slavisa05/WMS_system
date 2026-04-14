import { useParams, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Tag, Boxes, PackageCheck, PackageOpen, Phone } from "lucide-react";
import { useState } from 'react';
import { updateSkladiste, deleteSkladiste } from '@/api/skladiste';
import { createSektor } from '@/api/sektor';
import Header from '@/components/Header'
import Button from '@/components/Button'
import SektorCard from '@/components/SektorCard'
import useSkladiste from '@/hooks/useSkladiste';
import useSektore from '@/hooks/useSektore';
import useSlotovi from '@/hooks/useSlotovi';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import SkladisteForm, { type SkladisteFormErrors } from '@/components/forms/SkladisteForm';
import SektorForm, { type SektorFormErrors } from '@/components/forms/SektorForm';

const SkladisteDetaljiPage = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { skladiste, isLoading, error, refetch } = useSkladiste(Number(id));
    const { sektori, refetch: refetchSektore } = useSektore();
    const { slotovi } = useSlotovi();

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [skladisteErrors, setSkladisteErrors] = useState<SkladisteFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseSkladisteErrors = (err: any): SkladisteFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri izmeni skladišta' }
        }

        const fieldErrors: SkladisteFormErrors = {
            naziv: getFirstErrorMessage(data.naziv),
            adresa: getFirstErrorMessage(data.adresa),
            telefon: getFirstErrorMessage(data.telefon),
            tip: getFirstErrorMessage(data.tip),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.adresa && !fieldErrors.telefon && !fieldErrors.tip && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri izmeni skladišta'
        }

        return fieldErrors
    }

    const handleEdit = async (data: { naziv: string, adresa: string, telefon: string, tip: 'DIST' | 'VELE' | 'MALO' | 'TRAN' }) => {
        if (!skladiste) return
        setIsSubmitting(true)
        setSkladisteErrors({})
        try {
            await updateSkladiste(skladiste.id, data)
            setIsEditOpen(false)
            refetch()
        } catch (err: any) {
            setSkladisteErrors(parseSkladisteErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!skladiste) return
        setIsSubmitting(true)
        try {
            await deleteSkladiste(skladiste.id)
            navigate('/skladista')     
        } catch {
            alert('Greška pri brisanju partnera')
        } finally {
            setIsSubmitting(false)
        }
    }

    // DODAVANJE SEKTORA
    const [isAddSektorOpen, setIsAddSektorOpen] = useState(false)
    const [isSubmittingSektor, setIsSubmittingSektor] = useState(false)
    const [sektorErrors, setSektorErrors] = useState<SektorFormErrors>({})

    const getFirstErrorMessageSektor = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseSektorErrorsAdd = (err: any): SektorFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri dodavanju sektora' }
        }

        const fieldErrors: SektorFormErrors = {
            naziv: getFirstErrorMessageSektor(data.naziv),
            form: getFirstErrorMessageSektor(data.detail) || getFirstErrorMessageSektor(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju sektora'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { naziv: string }) => {
        setIsSubmittingSektor(true)
        setSektorErrors({})
        try {
            await createSektor({ ...data, skladiste: skladiste!.id })
            setIsAddSektorOpen(false)
            refetchSektore()
        } catch (err: any) {
            setSektorErrors(parseSektorErrorsAdd(err))
        } finally {
            setIsSubmittingSektor(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const sektoriSkladista = sektori.filter(s => s.skladiste.id === skladiste?.id);

    const slotoviSkladista = slotovi.filter(sl => sektoriSkladista.some(s => s.id === sl.sektor.id));
    const kapacitet = slotoviSkladista.reduce((sum, sl) => sum + sl.kapacitet, 0);
    const zauzeto = slotoviSkladista.reduce((sum, sl) => sum + sl.zauzet_kapacitet, 0);
    const slobodno = kapacitet - zauzeto;
    const procenat = kapacitet > 0 ? Math.round((zauzeto / kapacitet) * 100) : 0;

    return (
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji skladišta" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{skladiste?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><MapPin size={16} className="text-text-muted" />Adresa: {skladiste?.adresa}</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted" />Telefon: {skladiste?.telefon}</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted" />Tip: {skladiste?.tip}</p>
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
                    <h2>Sektori</h2> 
                    <div className="flex items-center gap-2 px-8 py-4 rounded-xl bg-sidebar">
                        <Button icon={Plus} text='dodaj sektor' onClick={() => setIsAddSektorOpen(true)} />
                    </div>
                </div>

                <div className="sm:w-[50%] w-[90%] flex flex-col gap-4">
                    {sektoriSkladista.map(s => (
                        <SektorCard key={s.id} {...s} />
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isEditOpen}
                title="Izmeni skladiste"
                onClose={() => {
                    setSkladisteErrors({})
                    setIsEditOpen(false)
                }}
            >
                <SkladisteForm
                    initialData={skladiste}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setSkladisteErrors({})
                        setIsEditOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={skladisteErrors}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši skladiste"
                message={`Da li ste sigurni da želite da izbrišete skladiste "${skladiste?.naziv}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />

            <Modal
                isOpen={isAddSektorOpen}
                title="Dodaj sektor"
                onClose={() => {
                    setSektorErrors({})
                    setIsAddSektorOpen(false)
                }}
            >
                <SektorForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setSektorErrors({})
                        setIsAddSektorOpen(false)
                    }}
                    isLoading={isSubmittingSektor}
                    errors={sektorErrors}
                />
            </Modal>
        </section>
    )
}

export default SkladisteDetaljiPage
