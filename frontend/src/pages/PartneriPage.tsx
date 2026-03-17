import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header"
import Button from "@/components/Button"
import SearchBar from "@/components/SearchBar"
import PartneriCard from "@/components/PartneriCard";

interface Partneri {
    id: number;
    naziv: string;
    pib: string;
    email: string;
    adresa: string;
    telefon: string;
    tip: 'dobavljac' | 'kupac';
}

const PartneriPage = () => {
    const [partneri, setPartneri] = useState<Partneri[]>([
        { id: 1, naziv: 'IDEA', pib: '123456789', email: 'idea@gmail.com', adresa: 'Prvog Maja 61, Ub 14210', telefon: '0640811781', tip: 'dobavljac'},
        { id: 2, naziv: 'MAXI', pib: '987654321', email: 'maxi@gmail.com', adresa: 'Prvog Maja 61, Ub 14210', telefon: '0640811782', tip: 'kupac'},
        { id: 3, naziv: 'RODA', pib: '123789456', email: 'roda@gmail.com', adresa: 'Prvog Maja 61, Ub 14210', telefon: '0640811783', tip: 'dobavljac'},
    ]);
    const [search, setSearch] = useState('');
    const [selectedTip, setSelectedTip] = useState('');

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
                    <PartneriCard key={p.id} id={p.id} naziv={p.naziv} pib={p.pib} email={p.email} adresa={p.adresa} telefon={p.telefon} tip={p.tip} />
                ))}
            </div>
        </section>
    );
}

export default PartneriPage