import { Plus, Search } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ZaliheCard from "@/components/ZaliheCard";
import SearchBar from "@/components/SearchBar";

interface Zaliha {
    id: number;
    proizvodId: number;
    proizvodNaziv: string;
    slotId: number;
    slotNaziv: string;
    sektorId: number;
    sektorNaziv: string;
    skladisteId: number;
    skladisteNaziv: string;
    kolicina: number;
    rezervisanaKolicina: number;
}

const ZalihePage = () => {
    const [zalihe, setZalihe] = useState<Zaliha[]>([
        { id: 1, proizvodId: 1, proizvodNaziv: 'koka kola', slotId: 1, slotNaziv: 'slot 1', sektorId: 1, sektorNaziv: 'sektor A', skladisteId: 1, skladisteNaziv: 'Veleprodaja', kolicina: 50, rezervisanaKolicina: 20},
        { id: 2, proizvodId: 2, proizvodNaziv: 'kokice', slotId: 2, slotNaziv: 'slot 2', sektorId: 2, sektorNaziv: 'sektor A', skladisteId: 2, skladisteNaziv: 'Maloprodaja', kolicina: 100, rezervisanaKolicina: 80},
        { id: 3, proizvodId: 3, proizvodNaziv: 'jeger', slotId: 3, slotNaziv: 'slot 3', sektorId: 3, sektorNaziv: 'sektor A', skladisteId: 3, skladisteNaziv: 'Veleprodaja', kolicina: 80, rezervisanaKolicina: 30},
    ]);
    const [search, setSearch] = useState('');
    const [selectedProizvod, setSelectedProizvod] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    const proizvodi_drop = [...new Set(zalihe.map(z => z.proizvodNaziv))];
    const slot_drop = [...new Set(zalihe.map(z => z.slotNaziv))];

    const filtered = zalihe.filter(z => {
        const matchSearch = z.proizvodNaziv.toLowerCase().includes(search.toLowerCase())
            || z.slotNaziv.toLowerCase().includes(search.toLowerCase())
            || z.skladisteNaziv.toLowerCase().includes(search.toLowerCase());
        const matchProizvod = selectedProizvod === '' || z.proizvodNaziv === selectedProizvod;
        const matchSlot = selectedSlot === '' || z.slotNaziv === selectedSlot;
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
                    <ZaliheCard key={z.id} id={z.id} proizvodNaziv={z.proizvodNaziv} slotNaziv={z.slotNaziv} sektorNaziv={z.sektorNaziv} skladisteNaziv={z.skladisteNaziv} kolicina={z.kolicina} rezervisanaKolicina={z.rezervisanaKolicina} />
                ))}
                {filtered.length === 0 && (
                    <p className="text-text-muted text-sm">Nema rezultata za zadatu pretragu.</p>
                )}
            </div>
        </section>
    );
}

export default ZalihePage

