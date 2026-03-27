import { useState } from "react";
import { Plus } from "lucide-react";
import { createVozilo } from "@/api/vozilo";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import VoziloCard from "@/components/VoziloCard";
import useVozila from "@/hooks/useVozila";
import Modal from "@/components/Modal";
import VoziloForm from "@/components/forms/VoziloForm";

const VozilaPage = () => {
    const { vozila, isLoading, error, refetch } = useVozila()
    const [search, setSearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (data: { model: string, registarski_broj: string, datum_registracije: string, poslednji_tehnicki: string, zaduzeni_vozac: number }) => {
        setIsSubmitting(true)
        try {
            await createVozilo(data)
            setIsAddOpen(false)
            refetch()
        } catch {
            alert('Greška pri dodavanju proizvoda')
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

            <Modal isOpen={isAddOpen} title="Dodaj vozilo" onClose={() => setIsAddOpen(false)}>
                <VoziloForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default VozilaPage