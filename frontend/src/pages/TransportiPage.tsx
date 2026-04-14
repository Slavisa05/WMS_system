import { useState } from "react";
import { createTransport } from "@/api/transport";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import TransportLogItem from "@/components/TransportLogItem";
import useTransporti from "@/hooks/useTransporti";
import Modal from "@/components/Modal";
import TransportForm, { type TransportFormErrors } from "@/components/forms/TransportForm";

const TransportiPage = () => {
    const { transporti ,isLoading, error, refetch } = useTransporti()
    const [search, setSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [transportErrors, setTransportErrors] = useState<TransportFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parseTransportErrors = (err: any): TransportFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri dodavanju transporta' }
        }

        const fieldErrors: TransportFormErrors = {
            vozac: getFirstErrorMessage(data.vozac),
            vozilo: getFirstErrorMessage(data.vozilo),
            datum_polaska: getFirstErrorMessage(data.datum_polaska),
            datum_zavrsetka: getFirstErrorMessage(data.datum_zavrsetka),
            status: getFirstErrorMessage(data.status),
            napomena: getFirstErrorMessage(data.napomena),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.vozac && !fieldErrors.vozilo && !fieldErrors.datum_polaska && !fieldErrors.datum_zavrsetka && !fieldErrors.status && !fieldErrors.napomena && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju transporta'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { vozac: number, vozilo: number, datum_polaska: string, datum_zavrsetka: string | null, status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO', napomena: string | null }) => {
        setIsSubmitting(true)
        setTransportErrors({})
        try {
            await createTransport(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setTransportErrors(parseTransportErrors(err))
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

            <Modal
                isOpen={isAddOpen}
                title="Dodaj transport"
                onClose={() => {
                    setTransportErrors({})
                    setIsAddOpen(false)
                }}
            >
                <TransportForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setTransportErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={transportErrors}
                />
            </Modal>
        </section>
    );
}

export default TransportiPage