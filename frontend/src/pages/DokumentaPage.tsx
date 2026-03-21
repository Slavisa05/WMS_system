import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";
import SearchBar from "@/components/SearchBar";
import useDokumenta from "@/hooks/useDokumenta";

const DokumentaPage = () => {
    const { dokumenta, isLoading, error } = useDokumenta()
    const [search, setSearch] = useState('');
    const [selectedTip, setSelectedTip] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const tip = [...new Set(dokumenta.map(d => d.tip))];
    const status = [...new Set(dokumenta.map(d => d.status))];

    const filtered = dokumenta.filter(d => {
        const matchSearch = d.datum_vreme.toLowerCase().includes(search.toLowerCase())
            || d.tip.toLowerCase().includes(search.toLowerCase())
            || d.status.toLowerCase().includes(search.toLowerCase())
            || d.zaposleni.ime.toLowerCase().includes(search.toLowerCase())
            || d.zaposleni.prezime.toLowerCase().includes(search.toLowerCase());
        const matchTip = selectedTip === '' || d.tip === selectedTip;
        const matchStatus = selectedStatus === '' || d.status === selectedStatus;
        return matchSearch && matchTip && matchStatus;
    });

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Dokumenta" />

            <SearchBar 
                search={search}
                onSearchChange={setSearch}
                filters={[
                    { value: selectedStatus, onChange: setSelectedStatus, placeholder: 'Svi statusi', options: status  },
                    { value: selectedTip, onChange: setSelectedTip, placeholder: 'Svi tipovi', options: tip  },
                ]}
                action={<Button icon={Plus} text="Novi dokument" />}
            />

            <div className="flex flex-col gap-4">
                {filtered.map(d => {
                    return (
                        <DocumentLogItem key={d.id} {...d} />
                    );
                })}
                {filtered.length === 0 && (
                    <p className="text-text-muted text-sm">Nema rezultata za zadatu pretragu.</p>
                )}
            </div>
        </section>
    );
}

export default DokumentaPage