import { useState } from "react";
import { Plus } from "lucide-react";
import { createProizvod } from "@/api/proizvod";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";
import SearchBar from "@/components/SearchBar";
import useProizvodi from "@/hooks/useProizvode";
import Modal from "@/components/Modal";
import ProizvodForm from "@/components/forms/ProizvodForm";

const ProizvodiPage = () => {
    const { proizvodi, isLoading, error, refetch } = useProizvodi()
    const [search, setSearch] = useState('')
    const [selectedKategorija, setSelectedKategorija] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (data: { naziv: string, barkod: string, sifra: string, jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol', kategorija: number }) => {
        setIsSubmitting(true)
        try {
            await createProizvod(data)
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

            <Modal isOpen={isAddOpen} title="Dodaj proizvod" onClose={() => setIsAddOpen(false)}>
                <ProizvodForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default ProizvodiPage