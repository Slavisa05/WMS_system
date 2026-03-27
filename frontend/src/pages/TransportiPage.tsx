import { useState } from "react";
import { createTransport } from "@/api/transport";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import TransportLogItem from "@/components/TransportLogItem";
import useTransporti from "@/hooks/useTransporti";
import Modal from "@/components/Modal";
import TransportForm from "@/components/forms/TransportForm";

const TransportiPage = () => {
    const { transporti ,isLoading, error, refetch } = useTransporti()
    const [search, setSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAdd = async (data: { vozac: number, vozilo: number, datum_polaska: string, datum_zavrsetka: string | null, status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO', napomena: string | null }) => {
        setIsSubmitting(true)
        try {
            await createTransport(data)
            setIsAddOpen(false)
            refetch()
        } catch {
            alert('Greška pri dodavanju transporta')
        } finally {
            setIsSubmitting(false)
        }
    }

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
                action={<Button icon={Plus} text="Dodaj transport" onClick={() => setIsAddOpen(true)} />}
            />

            <div className="flex flex-col w-full gap-2">
                {filtered.map(t => {
                    return(
                        <TransportLogItem key={t.id} {...t} />
                    );
                })}
            </div>

            <Modal isOpen={isAddOpen} title="Dodaj transport" onClose={() => setIsAddOpen(false)}>
                <TransportForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>
        </section>
    );
}

export default TransportiPage