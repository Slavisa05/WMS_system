import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";
import SearchBar from "@/components/SearchBar";

interface Proizvod {
    id: number;
    naziv: string;
    barkod: string;
    sifra: string;
    jedinica_mere: string;
    kategorija: string;
}

const ProizvodiPage = () => {
    const [proizvodi, setProizvodi] = useState<Proizvod[]>([
            { id: 1, naziv: 'Koka Kola', barkod: '12345678', sifra: 'KK-001', jedinica_mere: 'ml', kategorija: 'sokovi' },
            { id: 2, naziv: 'Fanta', barkod: '1234abcd', sifra: 'FA-001', jedinica_mere: 'ml', kategorija: 'sokovi' },
            { id: 3, naziv: 'Sprite', barkod: '1e3q5h7j', sifra: 'SP-001', jedinica_mere: 'l', kategorija: 'sokovi' },
            { id: 4, naziv: 'Mirinda', barkod: '564asdad', sifra: 'MI-001', jedinica_mere: 'ml', kategorija: 'sokovi' },
            { id: 5, naziv: 'Čips', barkod: 'ch1ps001', sifra: 'CH-001', jedinica_mere: 'g', kategorija: 'grickalice' },
            { id: 6, naziv: 'Kokice', barkod: 'kok1c001', sifra: 'KO-001', jedinica_mere: 'g', kategorija: 'grickalice' },
        ])
    const [search, setSearch] = useState('')
    const [selectedKategorija, setSelectedKategorija] = useState('')

    const kategorije = [...new Set(proizvodi.map(p => p.kategorija))]

    const filteredProizvodi = proizvodi.filter(p => {
        const matchSearch = p.naziv.toLowerCase().includes(search.toLowerCase())
        const matchKategorija = selectedKategorija === '' || p.kategorija === selectedKategorija
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
                    <ProizvodCard key={p.id} id={p.id} naziv={p.naziv} barkod={p.barkod} sifra={p.sifra} jedinica_mere={p.jedinica_mere} kategorija={p.kategorija} />
                ))}
            </div>
        </section>
    );
}

export default ProizvodiPage