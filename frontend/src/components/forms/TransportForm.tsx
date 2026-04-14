import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { Transport } from "@/types/transport"
import useZaposlene from "@/hooks/useZaposlene"
import useVozila from "@/hooks/useVozila"
import Button from "../Button"
import SearchableSelect from "@/components/SearchableSelect"

export interface TransportFormErrors {
    vozac?: string
    vozilo?: string
    datum_polaska?: string
    datum_zavrsetka?: string
    status?: string
    napomena?: string
    form?: string
}

interface TransportFormProps {
    onSubmit: (data: { 
        vozac: number,
        vozilo: number, 
        datum_polaska: string,
        datum_zavrsetka: string | null
        status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO'
        napomena: string | null
    }) => void
    onCancel: () => void
    initialData?: Transport | null
    isLoading?: boolean
    errors?: TransportFormErrors
}

const TransportForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: TransportFormProps) => {
    const { zaposlene } = useZaposlene()
    const { vozila } = useVozila()
    const [vozacId, setVozacId] = useState<number | ''>('')
    const [voziloId, setVoziloId] = useState<number | ''>('')
    const [datumPolaska, setDatumPolaska] = useState<Date | null>(null)
    const [datumZavrsetka, setDatumZavrsetka] = useState<Date | null>(null)
    const [status, setStatus] = useState<'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO'>('ZAKAZANO')
    const [napomena, setNapomena] = useState('')

    useEffect(() => {
        if (initialData) {
            setVozacId(initialData.vozac?.id ?? '')
            setVoziloId(initialData.vozilo?.id ?? '')
            setDatumPolaska(initialData.datum_polaska ? new Date(initialData.datum_polaska) : null)
            setDatumZavrsetka(initialData.datum_zavrsetka ? new Date(initialData.datum_zavrsetka) : null)
            setStatus(initialData.status ?? 'ZAKAZANO')
            setNapomena(initialData.napomena ?? '')
        } else {
            setVozacId('')
            setVoziloId('')
            setDatumPolaska(null)
            setDatumZavrsetka(null)
            setStatus('ZAKAZANO')
            setNapomena('')
        }
    }, [initialData])

    const handleSubmit = () => {
        if (vozacId === '' || voziloId === '' || !datumPolaska) return
        onSubmit({
            vozac: vozacId,
            vozilo: voziloId,
            datum_polaska: datumPolaska.toISOString(),
            datum_zavrsetka: datumZavrsetka ? datumZavrsetka.toISOString() : null,
            status,
            napomena
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <SearchableSelect
                        label="Vozač"
                        options={zaposlene.map(z => ({ id: z.id, label: `${z.ime} ${z.prezime}` }))}
                        value={vozacId}
                        onChange={setVozacId}
                        placeholder="Pretraži vozače..."
                        required
                        error={errors?.vozac}
                    />
                </div>

                <div className="col-span-2">
                    <SearchableSelect
                        label="Vozilo"
                        options={vozila.map(v => ({ id: v.id, label: `${v.model} — ${v.registarski_broj}` }))}
                        value={voziloId}
                        onChange={setVoziloId}
                        placeholder="Pretraži vozila..."
                        required
                        error={errors?.vozilo}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum polaska</label>
                    <DatePicker
                        selected={datumPolaska}
                        onChange={(date: Date | null) => setDatumPolaska(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd.MM.yyyy HH:mm"
                        placeholderText="Izaberi datum i vreme..."
                        required
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                        wrapperClassName="w-full"
                    />
                    {errors?.datum_polaska && <p className="text-xs text-red-500">{errors.datum_polaska}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum završetka <span className="text-text-muted">(opciono)</span></label>
                    <DatePicker
                        selected={datumZavrsetka}
                        onChange={(date: Date | null) => setDatumZavrsetka(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd.MM.yyyy HH:mm"
                        placeholderText="Izaberi datum i vreme..."
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                        wrapperClassName="w-full"
                    />
                    {errors?.datum_zavrsetka && <p className="text-xs text-red-500">{errors.datum_zavrsetka}</p>}
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm text-sidebar-text">Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value as typeof status)}
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                    >
                        <option className="bg-sidebar" value="ZAKAZANO">Zakazano</option>
                        <option className="bg-sidebar" value="U_TOKU">U toku</option>
                        <option className="bg-sidebar" value="ZAVRSENO">Završeno</option>
                        <option className="bg-sidebar" value="OTKAZANO">Otkazano</option>
                        <option className="bg-sidebar" value="NEUSPESNO">Neuspešno</option>
                    </select>
                    {errors?.status && <p className="text-xs text-red-500">{errors.status}</p>}
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm text-sidebar-text">Napomena <span className="text-text-muted">(opciono)</span></label>
                    <textarea
                        value={napomena ?? ''}
                        onChange={e => setNapomena(e.target.value)}
                        placeholder="Napomena..."
                        rows={3}
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary resize-none"
                    />
                    {errors?.napomena && <p className="text-xs text-red-500">{errors.napomena}</p>}
                </div>
            </div>

            {errors?.form && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {errors.form}
                </p>
            )}

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="button" onClick={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default TransportForm