import { useState, useEffect } from "react"
import type { Vozilo } from "@/types/transport"
import useZaposlene from "@/hooks/useZaposlene"
import Button from "../Button"
import FormInput from "./FormInput"
import SearchableSelect from "@/components/SearchableSelect"

interface VoziloFormProps {
    onSubmit: (data: { 
        model: string, 
        registarski_broj: string,
        datum_registracije: string,
        poslednji_tehnicki: string,
        zaduzeni_vozac: number,
    }) => void
    onCancel: () => void
    initialData?: Vozilo | null
    isLoading?: boolean
}

const VoziloForm = ({ onSubmit, onCancel, initialData, isLoading }: VoziloFormProps) => {
    const { zaposlene } = useZaposlene()
    const [model, setModel] = useState('')
    const [registarskiBroj, setRegistarskiBroj] = useState('')
    const [datumRegistracije, setDatumRegistracije] = useState('')
    const [poslednjiTehnicki, setPoslednjiTehnicki] = useState('')
    const [zaduzeniVozacId, setZaduzeniVozacId] = useState<number | ''>('')

    useEffect(() => {
        if (initialData) {
            setModel(initialData.model)
            setRegistarskiBroj(initialData.registarski_broj)
            setDatumRegistracije(initialData.datum_registracije)
            setPoslednjiTehnicki(initialData.poslednji_tehnicki)
            setZaduzeniVozacId(initialData.zaduzeni_vozac.id)
        } else {
            setModel('')
            setRegistarskiBroj('')
            setDatumRegistracije('')
            setPoslednjiTehnicki('')
            setZaduzeniVozacId('')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (zaduzeniVozacId === '') return
        onSubmit({ model, registarski_broj: registarskiBroj, datum_registracije: datumRegistracije, poslednji_tehnicki: poslednjiTehnicki, zaduzeni_vozac: zaduzeniVozacId })
    }

    const zaposleniOptions = zaposlene.map(z => ({ id: z.id, label: `${z.ime} ${z.prezime}` }))

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput label="Model" value={model} onChange={setModel} placeholder="Model vozila" required />
            <FormInput label="Registarski broj" value={registarskiBroj} onChange={setRegistarskiBroj} placeholder="BG-0000-BG" required />

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Datum registracije</label>
                <input
                    type="date"
                    value={datumRegistracije}
                    onChange={e => setDatumRegistracije(e.target.value)}
                    required
                    className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Poslednji tehnički</label>
                <input
                    type="date"
                    value={poslednjiTehnicki}
                    onChange={e => setPoslednjiTehnicki(e.target.value)}
                    required
                    className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                />
            </div>

            <SearchableSelect
                label="Zaduženi vozač"
                options={zaposleniOptions}
                value={zaduzeniVozacId}
                onChange={setZaduzeniVozacId}
                placeholder="Pretraži zaposlene..."
                required
            />

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default VoziloForm