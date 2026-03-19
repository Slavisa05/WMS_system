import { useState } from "react";
import { Move3D, Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import VoziloCard from "@/components/VoziloCard";

interface Vozilo {
    id: number;
    model: string;
    registarskiBroj: string;
    datumRegistracije: string;
    poslednjiTehnicki: string;
    zaduzeniVozac: string;
}

const VozilaPage = () => {
    const [vozila, setVozila] = useState<Vozilo[]>([
        { id: 1, model: 'VW Crafter', registarskiBroj: 'BG-1234-BG', datumRegistracije: '19/10/2025', poslednjiTehnicki: '19/02/2026', zaduzeniVozac: 'Mirko Mirkovic'},
        { id: 1, model: 'Mercedes Sprinter', registarskiBroj: 'BG-4321-BG', datumRegistracije: '19/10/2025', poslednjiTehnicki: '19/02/2026', zaduzeniVozac: 'Marko Markovic'},
        { id: 1, model: 'Ford Transit', registarskiBroj: 'BG-4324-GB', datumRegistracije: '19/10/2025', poslednjiTehnicki: '19/02/2026', zaduzeniVozac: 'Mirko Markovic'},
    ])
    const [search, setSearch] = useState('')

    const filtered = vozila.filter(v => {
        const matchSearch = v.model.toLowerCase().includes(search.toLowerCase())
            || v.registarskiBroj.toLowerCase().includes(search.toLowerCase())
            || v.zaduzeniVozac.toLowerCase().includes(search.toLowerCase())
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
                        <VoziloCard key={v.id} id={v.id} model={v.model} registarskiBroj={v.registarskiBroj} datumRegistracije={v.datumRegistracije} poslednjiTehnicki={v.poslednjiTehnicki} zaduzeniVozac={v.zaduzeniVozac} />
                    );
                })}
            </div>
        </section>
    );
}

export default VozilaPage