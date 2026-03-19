import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";
import SearchBar from "@/components/SearchBar";

interface Dokument {
    id: number;
    tip: 'PRIJEMNICA' | 'POVRATNICA_K' | 'OTPREMNICA' | 'POVRATNICA_D' | 'MEDJUSKLADISNICA' 
        | 'PRENOS' | 'INVENTAR' | 'OTPIS';
    status: 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN';
    datumVreme: string;
    zaposleni: string;
    poslovniPartner?: string;
}

const DokumentaPage = () => {
    const [dokumenti, setDokumenti] = useState<Dokument[]>([
        { id: 1, tip: 'PRIJEMNICA', status: 'ODOBREN', datumVreme: '17/11/2025 15:00:00h', zaposleni: 'Mirko Mirkovic', poslovniPartner: 'IDEA' },
        { id: 2, tip: 'OTPREMNICA', status: 'NA_CEKANJU', datumVreme: '18/11/2025 14:30:00h', zaposleni: 'Mirko Markovic', poslovniPartner: 'MAXI' },
        { id: 3, tip: 'MEDJUSKLADISNICA', status: 'ODBIJEN', datumVreme: '19/11/2025 17:00:00h', zaposleni: 'Marko Mirkovic' },
    ]);
    const [search, setSearch] = useState('');
    const [selectedTip, setSelectedTip] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const tip = [...new Set(dokumenti.map(d => d.tip))];
    const status = [...new Set(dokumenti.map(d => d.status))];

    const filtered = dokumenti.filter(d => {
        const matchSearch = d.datumVreme.toLowerCase().includes(search.toLowerCase())
            || d.tip.toLowerCase().includes(search.toLowerCase())
            || d.status.toLowerCase().includes(search.toLowerCase())
            || d.zaposleni.toLowerCase().includes(search.toLowerCase());
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
                        <DocumentLogItem key={d.id} id={d.id} tip={d.tip} datumVreme={d.datumVreme} status={d.status} zaposleni={d.zaposleni} poslovniPartner={d.poslovniPartner} />
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