import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import TransportLogItem from "@/components/TransportLogItem";

interface Vozilo {
    model: string;
    registarskiBroj: string;
}

interface Transport {
    id: number;
    vozilo: Vozilo;
    vozac: string;
    polazak: string;
    dolazak?: string;
    status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO';
}

const TransportiPage = () => {
    const [transporti, setTransporti] = useState<Transport[]>([
        { id: 1, vozilo: {model: 'VW Crafter', registarskiBroj: 'BG-1234-BG'}, vozac: 'Mirko Mirkovic', polazak: '18/03/2026 18:00h', status: 'U_TOKU' },
        { id: 1, vozilo: {model: 'VW Crafter', registarskiBroj: 'BG-1234-BG'}, vozac: 'Mirko Mirkovic', polazak: '18/03/2026 18:00h', status: 'NEUSPESNO' },
        { id: 1, vozilo: {model: 'VW Crafter', registarskiBroj: 'BG-1234-BG'}, vozac: 'Mirko Mirkovic', polazak: '18/03/2026 18:00h', status: 'ZAKAZANO' },
    ])
    const [search, setSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    const status = [...new Set(transporti.map(t => t.status))]
    
    const filtered = transporti.filter(t => {
        const matchSearch = t.vozilo.model.toLowerCase().includes(search.toLowerCase())
            || t.vozilo.registarskiBroj.toLowerCase().includes(search.toLowerCase())
            || t.vozac.toLowerCase().includes(search.toLowerCase())
            || t.polazak.toLowerCase().includes(search.toLowerCase())
        const matchStatus = selectedStatus === '' || t.status === selectedStatus
        return matchSearch && matchStatus
    })

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Transporti" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                filters={[
                    { value: selectedStatus, onChange: setSelectedStatus, placeholder: 'Svi statusi', options: status }
                ]}
                action={<Button icon={Plus} text="Dodaj transport" />}
            />

            <div className="flex flex-col w-full gap-2">
                {filtered.map(t => {
                    return(
                        <TransportLogItem key={t.id} id={t.id} vozilo={t.vozilo} vozac={t.vozac} polazak={t.polazak} dolazak={t.dolazak} status={t.status} />
                    );
                })}
            </div>
        </section>
    );
}

export default TransportiPage