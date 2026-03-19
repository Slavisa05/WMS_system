import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import ZaposleniCard from "@/components/ZaposleniCard";

interface Zaposleni {
    id: number;
    ime: string;
    prezime: string;
    ugovorDo: string;
    pozicija: 'Zaposleni' | 'Menadzer' | 'Admin';
} 

const ZaposleniPage = () => {
    const [zaposleni, setZaposleni] = useState<Zaposleni[]>([
        { id: 1, ime: 'Mirko', prezime: 'Mirkovic', ugovorDo: '19/10/2026', pozicija: 'Zaposleni' },
        { id: 2, ime: 'Andrija', prezime: 'Matic', ugovorDo: '19/10/2026', pozicija: 'Menadzer' },
        { id: 3, ime: 'Slavisa', prezime: 'Arsenijevic', ugovorDo: '19/10/2026', pozicija: 'Admin' },
    ]);
    const [search, setSearch] = useState('')
    const [selectedPozicija, setSelectedPozicija] = useState('')

    const pozicija = [...new Set(zaposleni.map(z => z.pozicija))]
    
    const filtered = zaposleni.filter(z => {
        const matchSearch = z.ime.toLowerCase().includes(search.toLowerCase())
            || z.prezime.toLowerCase().includes(search.toLowerCase())
        const matchPozicija = selectedPozicija === '' || z.pozicija === selectedPozicija
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
                action={<Button icon={Plus} text="Dodaj zaposlenog" />}
            />

            <div className="flex flex-wrap gap-2">
                {filtered.map(z => {
                    return(
                        <ZaposleniCard key={z.id} id={z.id} ime={z.ime} prezime={z.prezime} ugovorDo={z.ugovorDo} pozicija={z.pozicija} />
                    );
                })}
            </div>
        </section>
    );
}

export default ZaposleniPage