import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";
import SearchBar from "@/components/SearchBar";
import useProizvodi from "@/hooks/useProizvode";

const ProizvodiPage = () => {
    const { proizvodi, isLoading, error } = useProizvodi()
    const [search, setSearch] = useState('')
    const [selectedKategorija, setSelectedKategorija] = useState('')

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
                action={<Button icon={Plus} text="Dodaj proizvod" />}
            />
             
            <div className="flex flex-wrap gap-4">
                {filteredProizvodi.map(p => (
                    <ProizvodCard key={p.id} {...p} />
                ))}
            </div>
        </section>
    );
}

export default ProizvodiPage