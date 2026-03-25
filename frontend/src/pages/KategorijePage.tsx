import { useState } from "react";
import { Plus } from "lucide-react";
import { createKategorija } from "@/api/kategorija";
import Header from "@/components/Header";
import Button from "@/components/Button";
import KategorijaItem from "@/components/KategorijaItem";
import SearchBar from "@/components/SearchBar";
import useKategorije from "@/hooks/useKategorije";
import Modal from "@/components/Modal";
import KategorijaForm from "@/components/forms/KategorijaForm";

const KategorijePage = () => {
    const { kategorije, isLoading, error, refetch } = useKategorije();
    const [search, setSearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const filteredKategorija = kategorije.filter(k =>
        k.naziv.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = async (data: { naziv: string }) => {
        setIsSubmitting(true)
        try {
            await createKategorija(data)
            setIsAddOpen(false)
            refetch()
        } catch {
            alert('Greška pri dodavanju kategorije')
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

            <Modal isOpen={isAddOpen} title="Nova kategorija" onClose={() => setIsAddOpen(false)}>
                <KategorijaForm
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default KategorijePage