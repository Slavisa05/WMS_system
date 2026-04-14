import { useState } from "react";
import { Plus } from "lucide-react";
import { createProizvod } from "@/api/proizvod";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";
import SearchBar from "@/components/SearchBar";
import useProizvodi from "@/hooks/useProizvode";
import Modal from "@/components/Modal";
import ProizvodForm, { type ProizvodFormErrors } from "@/components/forms/ProizvodForm";

const ProizvodiPage = () => {
    const { proizvodi, isLoading, error, refetch } = useProizvodi()
    const [search, setSearch] = useState('')
    const [selectedKategorija, setSelectedKategorija] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [proizvodErrors, setProizvodErrors] = useState<ProizvodFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseProizvodErrors = (err: any): ProizvodFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri dodavanju proizvoda' }
        }

        const fieldErrors: ProizvodFormErrors = {
            naziv: getFirstErrorMessage(data.naziv),
            barkod: getFirstErrorMessage(data.barkod),
            sifra: getFirstErrorMessage(data.sifra),
            jedinica_mere: getFirstErrorMessage(data.jedinica_mere),
            kategorija: getFirstErrorMessage(data.kategorija),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.barkod && !fieldErrors.sifra && !fieldErrors.jedinica_mere && !fieldErrors.kategorija && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju proizvoda'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { naziv: string, barkod: string, sifra: string, jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol', kategorija: number }) => {
        setIsSubmitting(true)
            setProizvodErrors({})
        try {
            await createProizvod(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setProizvodErrors(parseProizvodErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const kategorije = [...new Set(proizvodi.map(p => p.kategorija.naziv))]

    const filteredProizvodi = proizvodi.filter(p => {
        const matchSearch = p.naziv.toLowerCase().includes(search.toLowerCase())
        const matchKategorija = selectedKategorija === '' || p.kategorija.naziv === selectedKategorija
        return matchSearch && matchKategorija
    })

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Poizvodi" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Pretraži proizvode..."
                filters={[
                    { value: selectedKategorija, onChange: setSelectedKategorija, placeholder: 'Sve kategorije', options: kategorije }
                ]}
                action={<Button icon={Plus} text="Dodaj proizvod" onClick={() => setIsAddOpen(true)} />}
            />
             
            <div className="flex flex-wrap gap-4">
                {filteredProizvodi.map(p => (
                    <ProizvodCard key={p.id} {...p} />
                ))}
            </div>

            <Modal
                isOpen={isAddOpen}
                title="Dodaj proizvod"
                onClose={() => {
                    setProizvodErrors({})
                    setIsAddOpen(false)
                }}
            >
                <ProizvodForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setProizvodErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                                    errors={proizvodErrors}
                />
            </Modal>
        </section>
    );
}

export default ProizvodiPage