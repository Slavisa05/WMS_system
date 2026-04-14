import { useState } from "react";
import { Plus } from "lucide-react";
import { createVozilo } from "@/api/vozilo";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import VoziloCard from "@/components/VoziloCard";
import useVozila from "@/hooks/useVozila";
import Modal from "@/components/Modal";
import VoziloForm, { type VoziloFormErrors } from "@/components/forms/VoziloForm";

const VozilaPage = () => {
    const { vozila, isLoading, error, refetch } = useVozila()
    const [search, setSearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
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
            return { form: 'Greška pri dodavanju vozila' }
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
            fieldErrors.form = 'Greška pri dodavanju vozila'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { model: string, registarski_broj: string, datum_registracije: string, poslednji_tehnicki: string, zaduzeni_vozac: number }) => {
        setIsSubmitting(true)
        setVoziloErrors({})
        try {
            await createVozilo(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setVoziloErrors(parseVoziloErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const filtered = vozila.filter(v => {
        const matchSearch = v.model.toLowerCase().includes(search.toLowerCase())
            || v.registarski_broj.toLowerCase().includes(search.toLowerCase())
            || v.zaduzeni_vozac.ime.toLowerCase().includes(search.toLowerCase())
            || v.zaduzeni_vozac.prezime.toLowerCase().includes(search.toLowerCase())
        return matchSearch 
    })

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Vozila" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Pretraži vozila..."
                action={<Button icon={Plus} text="Dodaj vozilo" onClick={() => setIsAddOpen(true)} />}
            />

            <div className="flex flex-wrap gap-2">
                {filtered.map(v => {
                    return(
                        <VoziloCard key={v.id} id={v.id} model={v.model} registarski_broj={v.registarski_broj} datum_registracije={v.datum_registracije} poslednji_tehnicki={v.poslednji_tehnicki} zaduzeni_vozac={v.zaduzeni_vozac} />
                    );
                })}
            </div>

            <Modal
                isOpen={isAddOpen}
                title="Dodaj vozilo"
                onClose={() => {
                    setVoziloErrors({})
                    setIsAddOpen(false)
                }}
            >
                <VoziloForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setVoziloErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={voziloErrors}
                />
            </Modal>
        </section>
    );
}

export default VozilaPage