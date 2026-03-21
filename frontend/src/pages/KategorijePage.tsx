import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import KategorijaItem from "@/components/KategorijaItem";
import SearchBar from "@/components/SearchBar";
import useKategorije from "@/hooks/useKategorije";

const KategorijePage = () => {
    const { kategorije, isLoading, error } = useKategorije();
    const [search, setSearch] = useState('')

    const filteredKategorija = kategorije.filter(k =>
        k.naziv.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;


    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Kategorije" />

            <SearchBar 
                search={search}
                onSearchChange={setSearch}
                action={<Button icon={Plus} text="Nova kategorija" />}
            />

            <div className="flex flex-wrap gap-4">
                {filteredKategorija.map(k => (
                    <KategorijaItem key={k.id} {...k} />
                ))}
            </div>
        </section>
    );
}

export default KategorijePage