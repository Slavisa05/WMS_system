import { useState } from "react";
import { Plus } from "lucide-react";
import { createZaposleni } from "@/api/zaposleni";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import ZaposleniCard from "@/components/ZaposleniCard";
import useZaposlene from "@/hooks/useZaposlene";
import Modal from "@/components/Modal";
import ZaposleniForm, { type ZaposleniFormErrors } from "@/components/forms/ZaposleniForm";

const ZaposleniPage = () => {
    const { zaposlene, isLoading, error, refetch } = useZaposlene();
    const [search, setSearch] = useState('')
    const [selectedPozicija, setSelectedPozicija] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [zaposleniErrors, setZaposleniErrors] = useState<ZaposleniFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseZaposleniErrors = (err: any): ZaposleniFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri dodavanju zaposlenog' }
        }

        const fieldErrors: ZaposleniFormErrors = {
            ime: getFirstErrorMessage(data.ime),
            prezime: getFirstErrorMessage(data.prezime),
            jmbg: getFirstErrorMessage(data.jmbg),
            broj_telefona: getFirstErrorMessage(data.broj_telefona),
            datum_rodjenja: getFirstErrorMessage(data.datum_rodjenja),
            datum_zaposlenja: getFirstErrorMessage(data.datum_zaposlenja),
            ugovor_do: getFirstErrorMessage(data.ugovor_do),
            pozicija: getFirstErrorMessage(data.pozicija),
            username: getFirstErrorMessage(data.username),
            password1: getFirstErrorMessage(data.password1),
            password2: getFirstErrorMessage(data.password2),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.ime && !fieldErrors.prezime && !fieldErrors.jmbg && !fieldErrors.broj_telefona && !fieldErrors.datum_rodjenja && !fieldErrors.datum_zaposlenja && !fieldErrors.ugovor_do && !fieldErrors.pozicija && !fieldErrors.username && !fieldErrors.password1 && !fieldErrors.password2 && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju zaposlenog'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { ime: string, prezime: string, jmbg: string, broj_telefona: string, datum_rodjenja: string, datum_zaposlenja: string, ugovor_do: string | null, pozicija: number }) => {
        setIsSubmitting(true)
        setZaposleniErrors({})
        try {
            await createZaposleni(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setZaposleniErrors(parseZaposleniErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const pozicija = [...new Set(zaposlene.map(z => z.pozicija?.naziv).filter((p): p is string => p != null))]
    
    const filtered = zaposlene.filter(z => {
        const matchSearch = z.ime.toLowerCase().includes(search.toLowerCase())
            || z.prezime.toLowerCase().includes(search.toLowerCase())
        const matchPozicija = selectedPozicija === '' || z.pozicija?.naziv === selectedPozicija
        return matchSearch && matchPozicija
    })
    
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Zaposleni" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                filters={[
                    { value: selectedPozicija, onChange: setSelectedPozicija, placeholder: 'Sve pozicije', options: pozicija }
                ]}
                action={<Button icon={Plus} text="Dodaj zaposlenog" onClick={() => setIsAddOpen(true)} />}
            />

            <div className="flex flex-wrap gap-2">
                {filtered.map(z => {
                    return(
                        <ZaposleniCard key={z.id} {...z} />
                    );
                })}
            </div>

            <Modal
                isOpen={isAddOpen}
                title="Dodaj zaposlenog"
                onClose={() => {
                    setZaposleniErrors({})
                    setIsAddOpen(false)
                }}
            >
                <ZaposleniForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setZaposleniErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={zaposleniErrors}
                />
            </Modal>
        </section>
    );
}

export default ZaposleniPage