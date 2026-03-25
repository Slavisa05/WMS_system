import { useState, useEffect } from 'react'
import type { PoslovniPartner } from '@/types/partner'
import Button from '@/components/Button'
import FormInput from '@/components/forms/FormInput'

interface PartnerFormProps {
    onSubmit: (data: { 
        naziv: string,
        pib: string,
        email: string,
        adresa: string,
        telefon: string,
        tip: 'D' | 'K',
    }) => void
    onCancel: () => void
    initialData?: PoslovniPartner | null  
    isLoading?: boolean
}

const PartnerForm = ({ onSubmit, onCancel, initialData, isLoading }: PartnerFormProps) => {
    const [naziv, setNaziv] = useState('')
    const [pib, setPib] = useState('')
    const [email, setEmail] = useState('')
    const [adresa, setAdresa] = useState('')
    const [telefon, setTelefon] = useState('')
    const [tip, setTip] = useState<'D' | 'K'>('D')

    useEffect(() => {
        if (initialData) {
            setNaziv(initialData.naziv)
            setPib(initialData.pib)
            setEmail(initialData.email)
            setAdresa(initialData.adresa)
            setTelefon(initialData.telefon)
            setTip(initialData.tip)
        } else {
            setNaziv('')
            setPib('')
            setEmail('')
            setAdresa('')
            setTelefon('')
            setTip('D')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ naziv, pib, email, adresa, telefon, tip })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput label="Naziv" value={naziv} onChange={setNaziv} placeholder="Naziv partnera" required />
            <FormInput label="PIB" value={pib} onChange={setPib} placeholder="PIB" required />
            <FormInput label="Email" value={email} onChange={setEmail} placeholder="email@primer.com" type="email" required />
            <FormInput label="Adresa" value={adresa} onChange={setAdresa} placeholder="Adresa" required />
            <FormInput label="Telefon" value={telefon} onChange={setTelefon} placeholder="+381..." required />

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Tip</label>
                <select
                    value={tip}
                    onChange={e => setTip(e.target.value as 'D' | 'K')}
                    className="px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
                >
                    <option className='bg-sidebar text-sidebar-text' value="D">Dobavljač</option>
                    <option className='bg-sidebar text-sidebar-text' value="K">Kupac</option>
                </select>
            </div>

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default PartnerForm