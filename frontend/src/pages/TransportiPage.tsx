import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import TransportLogItem from "@/components/TransportLogItem";
import useTransporti from "@/hooks/useTransporti";

const TransportiPage = () => {
    const { transporti ,isLoading, error } = useTransporti()
    const [search, setSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const status = [...new Set(transporti.map(t => t.status))]
    
    const filtered = transporti.filter(t => {
        const matchSearch = t.vozilo.model.toLowerCase().includes(search.toLowerCase())
            || t.vozilo.registarski_broj.toLowerCase().includes(search.toLowerCase())
            || t.vozac?.ime.toLowerCase().includes(search.toLowerCase())
            || t.vozac?.prezime.toLowerCase().includes(search.toLowerCase())
            || t.datum_polaska.toLowerCase().includes(search.toLowerCase())
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
                        <TransportLogItem key={t.id} {...t} />
                    );
                })}
            </div>
        </section>
    );
}

export default TransportiPage