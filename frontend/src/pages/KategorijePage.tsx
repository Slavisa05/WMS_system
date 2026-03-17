import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import KategorijaItem from "@/components/KategorijaItem";
import SearchBar from "@/components/SearchBar";

interface Kategorija {
    id: number;
    naziv: string;
    brojProizvoda: number;
}

const KategorijePage = () => {
    const [kategorije, setKategorije] = useState<Kategorija[]>([
            { id: 1, naziv: 'sokovi', brojProizvoda: 20 },
            { id: 2, naziv: 'grickalice', brojProizvoda: 50 },
            { id: 3, naziv: 'alkohol', brojProizvoda: 30 },
            { id: 4, naziv: 'kesice', brojProizvoda: 100 },
        ])
        const [search, setSearch] = useState('')
    
        const filteredKategorija = kategorije.filter(k =>
            k.naziv.toLowerCase().includes(search.toLowerCase())
        )

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
                    <KategorijaItem key={k.id} id={k.id} naziv={k.naziv} brojProizvoda={k.brojProizvoda} />
                ))}
            </div>
        </section>
    );
}

export default KategorijePage