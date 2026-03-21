import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header"
import Button from "@/components/Button"
import SearchBar from "@/components/SearchBar"
import PartneriCard from "@/components/PartneriCard";
import usePartneri from "@/hooks/usePartneri";

const PartneriPage = () => {
    const { partneri, isLoading, error } = usePartneri()
    const [search, setSearch] = useState('');
    const [selectedTip, setSelectedTip] = useState('');

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
                action={<Button icon={Plus} text="Dodaj partnera" />}
            />

            <div className="flex flex-wrap gap-4">
                {filtered.map(p => (
                    <PartneriCard key={p.id} {...p} />
                ))}
            </div>
        </section>
    );
}

export default PartneriPage