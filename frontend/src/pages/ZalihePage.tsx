import { Plus } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ZaliheCard from "@/components/ZaliheCard";
import SearchBar from "@/components/SearchBar";
import useZalihe from "@/hooks/useZalihe";

const ZalihePage = () => {
    const { zalihe, isLoading, error } = useZalihe()
    const [search, setSearch] = useState('');
    const [selectedProizvod, setSelectedProizvod] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const proizvodi_drop = [...new Set(zalihe.map(z => z.proizvod.naziv))];
    const slot_drop = [...new Set(zalihe.map(z => z.slot.naziv))];

    const filtered = zalihe.filter(z => {
        const matchSearch = z.proizvod.naziv.toLowerCase().includes(search.toLowerCase())
            || z.slot.naziv.toLowerCase().includes(search.toLowerCase())
            || z.slot.sektor.skladiste.naziv.toLowerCase().includes(search.toLowerCase());
        const matchProizvod = selectedProizvod === '' || z.proizvod.naziv === selectedProizvod;
        const matchSlot = selectedSlot === '' || z.slot.naziv === selectedSlot;
        return matchSearch && matchProizvod && matchSlot;
    });

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Zalihe" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                filters={[
                    { value: selectedProizvod, onChange: setSelectedProizvod, placeholder: 'Svi proizvodi', options: proizvodi_drop },
                    { value: selectedSlot, onChange: setSelectedSlot, placeholder: 'Svi slotovi', options: slot_drop },
                ]}
                action={<Button icon={Plus} text="Dodaj nove zalihe" />}
            />

            <div className="flex flex-wrap gap-4">
                {filtered.map(z => (
                    <ZaliheCard key={z.id} {...z} />
                ))}
                {filtered.length === 0 && (
                    <p className="text-text-muted text-sm">Nema rezultata za zadatu pretragu.</p>
                )}
            </div>
        </section>
    );
}

export default ZalihePage

