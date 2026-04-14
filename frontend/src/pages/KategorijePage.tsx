import { useState } from "react";
import { Plus } from "lucide-react";
import { createKategorija } from "@/api/kategorija";
import Header from "@/components/Header";
import Button from "@/components/Button";
import KategorijaItem from "@/components/KategorijaItem";
import SearchBar from "@/components/SearchBar";
import useKategorije from "@/hooks/useKategorije";
import Modal from "@/components/Modal";
import KategorijaForm, { type KategorijaFormErrors } from "@/components/forms/KategorijaForm";

const KategorijePage = () => {
    const { kategorije, isLoading, error, refetch } = useKategorije();
    const [search, setSearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
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
            return { form: 'Greška pri dodavanju kategorije' }
        }

        const fieldErrors: KategorijaFormErrors = {
            naziv: getFirstErrorMessage(data.naziv),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju kategorije'
        }

        return fieldErrors
    }

    const filteredKategorija = kategorije.filter(k =>
        k.naziv.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = async (data: { naziv: string }) => {
        setIsSubmitting(true)
            setKategorijaErrors({})
        try {
            await createKategorija(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setKategorijaErrors(parseKategorijaErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    return (
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Kategorije" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                action={
                    <Button
                        icon={Plus}
                        text="Nova kategorija"
                        onClick={() => setIsAddOpen(true)}
                    />
                }
            />

            <div className="flex flex-wrap gap-4">
                {filteredKategorija.map(k => (
                    <KategorijaItem key={k.id} {...k} />
                ))}
            </div>

            <Modal
                isOpen={isAddOpen}
                title="Nova kategorija"
                onClose={() => {
                    setKategorijaErrors({})
                    setIsAddOpen(false)
                }}
            >
                <KategorijaForm
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setKategorijaErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                                    errors={kategorijaErrors}
                />
            </Modal>
        </section>
    );
}

export default KategorijePage