import { useState, useEffect } from "react"
import type { Vozilo } from "@/types/transport"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import useZaposlene from "@/hooks/useZaposlene"
import Button from "../Button"
import FormInput from "./FormInput"
import SearchableSelect from "@/components/SearchableSelect"

export interface VoziloFormErrors {
    model?: string
    registarski_broj?: string
    datum_registracije?: string
    poslednji_tehnicki?: string
    zaduzeni_vozac?: string
    form?: string
}

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
    errors?: VoziloFormErrors
}

const VoziloForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: VoziloFormProps) => {
    const { zaposlene } = useZaposlene()
    const [model, setModel] = useState('')
    const [registarskiBroj, setRegistarskiBroj] = useState('')
    const [datumRegistracije, setDatumRegistracije] = useState<Date | null>(null)
    const [poslednjiTehnicki, setPoslednjiTehnicki] = useState<Date | null>(null)
    const [zaduzeniVozacId, setZaduzeniVozacId] = useState<number | ''>('')

    useEffect(() => {
        if (initialData) {
            setModel(initialData.model)
            setRegistarskiBroj(initialData.registarski_broj)
            setDatumRegistracije(initialData.datum_registracije ? new Date(initialData.datum_registracije) : null)
            setPoslednjiTehnicki(initialData.poslednji_tehnicki ? new Date(initialData.poslednji_tehnicki) : null)
            setZaduzeniVozacId(initialData.zaduzeni_vozac.id)
        } else {
            setModel('')
            setRegistarskiBroj('')
            setDatumRegistracije(null)
            setPoslednjiTehnicki(null)
            setZaduzeniVozacId('')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (zaduzeniVozacId === '' || !datumRegistracije || !poslednjiTehnicki) return
        onSubmit({
            model,
            registarski_broj: registarskiBroj,
            datum_registracije: datumRegistracije.toISOString().split('T')[0],
            poslednji_tehnicki: poslednjiTehnicki.toISOString().split('T')[0],
            zaduzeni_vozac: zaduzeniVozacId
        })
    }

    const zaposleniOptions = zaposlene.map(z => ({ id: z.id, label: `${z.ime} ${z.prezime}` }))

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput label="Model" value={model} onChange={setModel} placeholder="Model vozila" required error={errors?.model} />
            <FormInput label="Registarski broj" value={registarskiBroj} onChange={setRegistarskiBroj} placeholder="BG-0000-BG" required error={errors?.registarski_broj} />

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Datum registracije</label>
                <DatePicker
                    selected={datumRegistracije}
                    onChange={(date: Date | null) => setDatumRegistracije(date)}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="Izaberi datum..."
                    required
                    className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                    wrapperClassName="w-full"
                />
                {errors?.datum_registracije && <p className="text-xs text-red-500">{errors.datum_registracije}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Poslednji tehnički</label>
                <DatePicker
                    selected={poslednjiTehnicki}
                    onChange={(date: Date | null) => setPoslednjiTehnicki(date)}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="Izaberi datum..."
                    required
                    className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                    wrapperClassName="w-full"
                />
                {errors?.poslednji_tehnicki && <p className="text-xs text-red-500">{errors.poslednji_tehnicki}</p>}
            </div>

            <SearchableSelect
                label="Zaduženi vozač"
                options={zaposleniOptions}
                value={zaduzeniVozacId}
                onChange={setZaduzeniVozacId}
                placeholder="Pretraži zaposlene..."
                required
                error={errors?.zaduzeni_vozac}
            />

            {errors?.form && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {errors.form}
                </p>
            )}

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default VoziloForm