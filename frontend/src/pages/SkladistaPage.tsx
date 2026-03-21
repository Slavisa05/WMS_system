import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import SkladisteCard from "@/components/SkladisteCard";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import useSkladista from "@/hooks/useSkladista";

const SkladistaPage = () => {
    const { skladista, isLoading, error } = useSkladista()
    const [search, setSearch] = useState('')

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
                action={<Button icon={Plus} text="Dodaj novo skladište" />}
            />

            <div className="flex flex-wrap w-full gap-3">
                {filteredSkladista.map(s => (
                    <SkladisteCard key={s.id} {...s} />
                ))}
            </div>
        </section>
    );
}

export default SkladistaPage