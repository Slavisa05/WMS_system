import { useState, useEffect } from "react"
import type { Skladiste } from "@/types/skladiste"
import Button from "../Button"
import FormInput from "./FormInput"

interface SkladisteFormProps {
    onSubmit: (data: {
        naziv: string,
        adresa: string,
        telefon: string,
        tip: 'DIST' | 'VELE' | 'MALO' | 'TRAN',
    }) => void
    onCancel: () => void
    initialData?: Skladiste | null  
    isLoading?: boolean
}

const SkladisteForm = ({ onSubmit, onCancel, initialData, isLoading }: SkladisteFormProps) => {
    const [naziv, setNaziv] = useState('')
    const [adresa, setAdresa] = useState('')
    const [telefon, setTelefon] = useState('')
    const [tip, setTip] = useState<'DIST' | 'VELE' | 'MALO' | 'TRAN'>('DIST')

    useEffect(() => {
        if (initialData) {
            setNaziv(initialData.naziv)
            setAdresa(initialData.adresa)
            setTelefon(initialData.telefon)
            setTip(initialData.tip)
        } else {
            setNaziv('')
            setAdresa('')
            setTelefon('')
            setTip('DIST')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ naziv, adresa, telefon, tip })
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput label="Naziv" value={naziv} onChange={setNaziv} placeholder="Naziv skladista" required />
            <FormInput label="Adresa" value={adresa} onChange={setAdresa} placeholder="Adresa" required />
            <FormInput label="Telefon" value={telefon} onChange={setTelefon} placeholder="+381..." required />

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Tip</label>
                <select
                    value={tip}
                    onChange={e => setTip(e.target.value as 'DIST' | 'VELE' | 'MALO' | 'TRAN')}
                    className="px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
                >
                    <option className='bg-sidebar text-sidebar-text' value="DIST">Distributivni centar</option>
                    <option className='bg-sidebar text-sidebar-text' value="VELE">Veleprodajno skladište</option>
                    <option className='bg-sidebar text-sidebar-text' value="MALO">Maloprodajni magacin</option>
                    <option className='bg-sidebar text-sidebar-text' value="TRAN">Tranzit</option>
                </select>
            </div>

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default SkladisteForm