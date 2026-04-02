import { useState, useEffect } from "react"
import type { Transport } from "@/types/transport"
import useZaposlene from "@/hooks/useZaposlene"
import useVozila from "@/hooks/useVozila"
import Button from "../Button"
import SearchableSelect from "@/components/SearchableSelect"

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
}

const TransportForm = ({ onSubmit, onCancel, initialData, isLoading }: TransportFormProps) => {
    const { zaposlene } = useZaposlene()
    const { vozila } = useVozila()
    const [vozacId, setVozacId] = useState<number | ''>('')
    const [voziloId, setVoziloId] = useState<number | ''>('')
    const [datumPolaska, setDatumPolaska] = useState('')
    const [datumZavrsetka, setDatumZavrsetka] = useState<string | null>(null)
    const [status, setStatus] = useState<'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO'>('ZAKAZANO')
    const [napomena, setNapomena] = useState('')

    const toDatetimeLocal = (val?: string | null) => {
        if (!val) return ''
        return val.slice(0, 16) // "YYYY-MM-DDTHH:MM"
    }

    useEffect(() => {
        if (initialData) {
            setVozacId(initialData.vozac?.id ?? '')
            setVoziloId(initialData.vozilo?.id ?? '')
            setDatumPolaska(toDatetimeLocal(initialData.datum_polaska))
            setDatumZavrsetka(initialData.datum_zavrsetka ? toDatetimeLocal(initialData.datum_zavrsetka) : null)
            setStatus(initialData.status ?? 'ZAKAZANO')
            setNapomena(initialData.napomena ?? '')
        } else {
            setVozacId('')
            setVoziloId('')
            setDatumPolaska('')
            setDatumZavrsetka(null)
            setStatus('ZAKAZANO')
            setNapomena('')
        }
    }, [initialData])

    const handleSubmit = () => {
        if (vozacId === '' || voziloId === '') return
        onSubmit({
            vozac: vozacId, vozilo: voziloId, datum_polaska: datumPolaska, datum_zavrsetka: datumZavrsetka, status, napomena
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
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum polaska</label>
                    <input
                        type="datetime-local"
                        value={datumPolaska}
                        onChange={e => setDatumPolaska(e.target.value)}
                        required
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum završetka <span className="text-text-muted">(opciono)</span></label>
                    <input
                        type="datetime-local"
                        value={datumZavrsetka ?? ''}
                        onChange={e => setDatumZavrsetka(e.target.value || null)}
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                    />
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
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="button" onClick={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default TransportForm