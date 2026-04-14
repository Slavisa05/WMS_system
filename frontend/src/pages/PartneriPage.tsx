import { useState } from "react";
import { Plus } from "lucide-react";
import { createPartner } from "@/api/partner";
import Header from "@/components/Header"
import Button from "@/components/Button"
import SearchBar from "@/components/SearchBar"
import PartneriCard from "@/components/PartneriCard";
import usePartneri from "@/hooks/usePartneri";
import Modal from "@/components/Modal";
import PartnerForm, { type PartnerFormErrors } from "@/components/forms/PartnerForm";

const PartneriPage = () => {
    const { partneri, isLoading, error, refetch } = usePartneri()
    const [search, setSearch] = useState('');
    const [selectedTip, setSelectedTip] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [partnerErrors, setPartnerErrors] = useState<PartnerFormErrors>({})

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            const first = value[0]
            return typeof first === 'string' ? first : undefined
        }
        return typeof value === 'string' ? value : undefined
    }

    const parsePartnerErrors = (err: any): PartnerFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: 'Greška pri dodavanju partnera' }
        }

        const fieldErrors: PartnerFormErrors = {
            naziv: getFirstErrorMessage(data.naziv),
            pib: getFirstErrorMessage(data.pib),
            email: getFirstErrorMessage(data.email),
            adresa: getFirstErrorMessage(data.adresa),
            telefon: getFirstErrorMessage(data.telefon),
            tip: getFirstErrorMessage(data.tip),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.naziv && !fieldErrors.pib && !fieldErrors.email && !fieldErrors.adresa && !fieldErrors.telefon && !fieldErrors.tip && !fieldErrors.form) {
            fieldErrors.form = 'Greška pri dodavanju partnera'
        }

        return fieldErrors
    }

    const handleAdd = async (data: { naziv: string, pib: string, email: string, adresa: string, telefon: string, tip: 'D' | 'K' }) => {
        setIsSubmitting(true)
        setPartnerErrors({})
        try {
            await createPartner(data)
            setIsAddOpen(false)
            refetch()
        } catch (err: any) {
            setPartnerErrors(parsePartnerErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const tip = [...new Set(partneri.map(p => p.tip))];

    const filtered = partneri.filter(p => {
        const matchSearch = p.naziv.toLowerCase().includes(search.toLowerCase())
            || p.pib.toLowerCase().includes(search.toLowerCase())
            || p.email.toLowerCase().includes(search.toLowerCase())
            || p.telefon.toLowerCase().includes(search.toLowerCase());
        const matchTip = selectedTip === '' || p.tip === selectedTip;
        return matchSearch && matchTip;
    });
    
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Poslovni Partneri" />

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Pretraži partnere..."
                filters={[
                    { value: selectedTip, onChange: setSelectedTip, placeholder: 'Svi tipovi', options: tip }
                ]}
                action={<Button onClick={() => setIsAddOpen(true)} icon={Plus} text="Dodaj partnera" />}
            />

            <div className="flex flex-wrap gap-4">
                {filtered.map(p => (
                    <PartneriCard key={p.id} {...p} />
                ))}
            </div>

            <Modal
                isOpen={isAddOpen}
                title="Novi partner"
                onClose={() => {
                    setPartnerErrors({})
                    setIsAddOpen(false)
                }}
            >
                <PartnerForm 
                    onSubmit={handleAdd}
                    onCancel={() => {
                        setPartnerErrors({})
                        setIsAddOpen(false)
                    }}
                    isLoading={isSubmitting}
                    errors={partnerErrors}
                />
            </Modal>
        </section>
    );
}

export default PartneriPage