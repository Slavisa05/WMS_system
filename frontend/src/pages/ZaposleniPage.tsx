import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import ZaposleniCard from "@/components/ZaposleniCard";
import useZaposlene from "@/hooks/useZaposlene";

const ZaposleniPage = () => {
    const { zaposlene, isLoading, error} = useZaposlene();
    const [search, setSearch] = useState('')
    const [selectedPozicija, setSelectedPozicija] = useState('')

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
                action={<Button icon={Plus} text="Dodaj zaposlenog" />}
            />

            <div className="flex flex-wrap gap-2">
                {filtered.map(z => {
                    return(
                        <ZaposleniCard key={z.id} {...z} />
                    );
                })}
            </div>
        </section>
    );
}

export default ZaposleniPage