import { useState } from "react";
import { Plus } from "lucide-react";
import { createSkladiste } from "@/api/skladiste";
import Header from "@/components/Header";
import SkladisteCard from "@/components/SkladisteCard";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import useSkladista from "@/hooks/useSkladista";
import Modal from "@/components/Modal";
import SkladisteForm from "@/components/forms/SkladisteForm";

const SkladistaPage = () => {
    const { skladista, isLoading, error, refetch } = useSkladista()
    const [search, setSearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (data: { naziv: string, adresa: string, telefon: string, tip: 'DIST' | 'VELE' | 'MALO' | 'TRAN' }) => {
        setIsSubmitting(true)
        try {
            await createSkladiste(data)
            setIsAddOpen(false)
            refetch()
        } catch {
            alert('Greška pri dodavanju partnera')
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

            <Modal isOpen={isAddOpen} title="Novo skladiste" onClose={() => setIsAddOpen(false)}>
                <SkladisteForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default SkladistaPage