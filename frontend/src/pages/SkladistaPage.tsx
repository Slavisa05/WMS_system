import { useState } from "react";
import { Plus } from "lucide-react";
import { createSkladiste } from "@/api/skladiste";
import Header from "@/components/Header";
import SkladisteCard from "@/components/SkladisteCard";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import useSkladista from "@/hooks/useSkladista";
import Modal from "@/components/Modal";
import SkladisteForm, { type SkladisteFormErrors } from "@/components/forms/SkladisteForm";

const SkladistaPage = () => {
    const { skladista, isLoading, error, refetch } = useSkladista()
    const [search, setSearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
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
            return { form: 'Greška pri dodavanju skladišta' }
        }

        const fieldErrors: SkladisteFormErrors = {
            naziv: getFirstErrorMessage(data.naziv),
            adresa: getFirstErrorMessage(data.adresa),
            telefon: getFirstErrorMessage(data.telefon),
            tip: getFirstErrorMessage(data.tip),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.adresa && !fieldErrors.telefon && !fieldErrors.tip && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju skladišta'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { naziv: string, adresa: string, telefon: string, tip: 'DIST' | 'VELE' | 'MALO' | 'TRAN' }) => {
        setIsSubmitting(true)
        setSkladisteErrors({})
        try {
            await createSkladiste(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setSkladisteErrors(parseSkladisteErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const filteredSkladista = skladista.filter(s =>
        s.naziv.toLowerCase().includes(search.toLowerCase())
    )

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading='Skladista' />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Pretraži skladišta..."
                action={<Button onClick={() => setIsAddOpen(true)} icon={Plus} text="Dodaj novo skladište" />}
            />

            <div className="flex flex-wrap w-full gap-3">
                {filteredSkladista.map(s => (
                    <SkladisteCard key={s.id} {...s} />
                ))}
            </div>

            <Modal
                isOpen={isAddOpen}
                title="Novo skladiste"
                onClose={() => {
                    setSkladisteErrors({})
                    setIsAddOpen(false)
                }}
            >
                <SkladisteForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setSkladisteErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={skladisteErrors}
                />
            </Modal>
        </section>
    );
}

export default SkladistaPage