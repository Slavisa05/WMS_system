import { useState } from "react";
import { Plus } from "lucide-react";
import { createPartner } from "@/api/partner";
import Header from "@/components/Header"
import Button from "@/components/Button"
import SearchBar from "@/components/SearchBar"
import PartneriCard from "@/components/PartneriCard";
import usePartneri from "@/hooks/usePartneri";
import Modal from "@/components/Modal";
import PartnerForm from "@/components/forms/PartnerForm";

const PartneriPage = () => {
    const { partneri, isLoading, error, refetch } = usePartneri()
    const [search, setSearch] = useState('');
    const [selectedTip, setSelectedTip] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (data: { naziv: string, pib: string, email: string, adresa: string, telefon: string, tip: 'D' | 'K' }) => {
        setIsSubmitting(true)
        try {
            await createPartner(data)
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

    const tip = [...new Set(partneri.map(p => p.tip))];

    const filtered = partneri.filter(p => {
        const matchSearch = p.naziv.toLowerCase().includes(search.toLowerCase())
            || p.pib.toLowerCase().includes(search.toLowerCase())
            || p.email.toLowerCase().includes(search.toLowerCase())
            || p.telefon.toLowerCase().includes(search.toLowerCase());
        const matchTip = selectedTip === '' || p.tip === selectedTip;
        return matchSearch && matchTip;
    });
    
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Poslovni Partneri" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Pretraži partnere..."
                filters={[
                    { value: selectedTip, onChange: setSelectedTip, placeholder: 'Svi tipovi', options: tip }
                ]}
                action={<Button onClick={() => setIsAddOpen(true)} icon={Plus} text="Dodaj partnera" />}
            />

            <div className="flex flex-wrap gap-4">
                {filtered.map(p => (
                    <PartneriCard key={p.id} {...p} />
                ))}
            </div>

            <Modal isOpen={isAddOpen} title="Novi partner" onClose={() => setIsAddOpen(false)}>
                <PartnerForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default PartneriPage