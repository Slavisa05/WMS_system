import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import VoziloCard from "@/components/VoziloCard";
import useVozila from "@/hooks/useVozila";

const VozilaPage = () => {
    const { vozila, isLoading, error } = useVozila()
    const [search, setSearch] = useState('')

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
                action={<Button icon={Plus} text="Dodaj vozilo" />}
            />

            <div className="flex flex-wrap gap-2">
                {filtered.map(v => {
                    return(
                        <VoziloCard key={v.id} id={v.id} model={v.model} registarski_broj={v.registarski_broj} datum_registracije={v.datum_registracije} poslednji_tehnicki={v.poslednji_tehnicki} zaduzeni_vozac={v.zaduzeni_vozac} />
                    );
                })}
            </div>
        </section>
    );
}

export default VozilaPage