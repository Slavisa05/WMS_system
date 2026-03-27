import { useState } from "react";
import { Plus } from "lucide-react";
import { createZaposleni } from "@/api/zaposleni";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import ZaposleniCard from "@/components/ZaposleniCard";
import useZaposlene from "@/hooks/useZaposlene";
import Modal from "@/components/Modal";
import ZaposleniForm from "@/components/forms/ZaposleniForm";

const ZaposleniPage = () => {
    const { zaposlene, isLoading, error, refetch } = useZaposlene();
    const [search, setSearch] = useState('')
    const [selectedPozicija, setSelectedPozicija] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (data: { ime: string, prezime: string, jmbg: string, broj_telefona: string, datum_zaposlenja: string, ugovor_do: string | null, pozicija: number }) => {
        setIsSubmitting(true)
        try {
            await createZaposleni(data)
            setIsAddOpen(false)
            refetch()
        } catch {
            alert('Greška pri dodavanju zaposlenog')
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

            <Modal isOpen={isAddOpen} title="Dodaj zaposlenog" onClose={() => setIsAddOpen(false)}>
                <ZaposleniForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default ZaposleniPage