import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { Dokument } from "@/types/dokument"
import { createTransport } from "@/api/transport"
import { useAuth } from "@/context/AuthContext"
import usePartneri from "@/hooks/usePartneri"
import useZaposlene from "@/hooks/useZaposlene"
import useSkladista from "@/hooks/useSkladista"
import useTransporti from "@/hooks/useTransporti"
import useProizvodi from "@/hooks/useProizvode"
import useSlotovi from "@/hooks/useSlotovi"
import Button from "../Button"
import SearchableSelect from "@/components/SearchableSelect"
import TransportForm from "./TransportForm"
import Modal from "../Modal"

type TipDokumenta = 'PRIJEMNICA' | 'POVRATNICA_K' | 'OTPREMNICA' | 'POVRATNICA_D' | 'MEDJUSKLADISNICA' | 'PRENOS' | 'INVENTAR' | 'OTPIS'
type StatusDokumenta = 'NACRT' | 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN'

interface StavkaPayload {
    proizvod: number
    slot_ulaza: number | null
    slot_izlaza: number | null
    kolicina: number
    cena: number
}

export interface DokumentPayload {
    tip: TipDokumenta
    datum_vreme: string
    poslovni_partner: number | null
    zaposleni: number
    skladiste_ulaza: number | null
    skladiste_izlaza: number | null
    transport: number | null
    status: StatusDokumenta
    stavke: StavkaPayload[]
}

export interface DokumentFormErrors {
    tip?: string
    datum_vreme?: string
    poslovni_partner?: string
    zaposleni?: string
    skladiste_ulaza?: string
    skladiste_izlaza?: string
    transport?: string
    status?: string
    stavke?: string
    form?: string
}

interface DokumentFormProps {
    onSubmit: (data: DokumentPayload) => void
    onCancel: () => void
    initialData?: Dokument | null
    isLoading?: boolean
    errors?: DokumentFormErrors
}

interface StavkaRow {
    tempId: number
    proizvod: number | ''
    slot_ulaza: number | ''
    slot_izlaza: number | ''
    kolicina: number | ''
    cena: number | ''
}

let _tempId = 0
const newRow = (): StavkaRow => ({
    tempId: ++_tempId, proizvod: '', slot_ulaza: '', slot_izlaza: '', kolicina: '', cena: ''
})

const inputCls = "px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"

const DokumentForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: DokumentFormProps) => {
    const { user } = useAuth()
    const { zaposlene } = useZaposlene()
    const { partneri } = usePartneri()
    const { skladista } = useSkladista()
    const { transporti, refetch } = useTransporti()
    const { proizvodi } = useProizvodi()
    const { slotovi } = useSlotovi()

    const [tip, setTip] = useState<TipDokumenta>('PRIJEMNICA')
    const [datumVreme, setDatumVreme] = useState<Date | null>(null)
    const [partnerId, setPartnerId] = useState<number | ''>('')
    const [zaposleniId, setZaposleniId] = useState<number | ''>('')
    const [skladisteUlazaId, setSkladisteUlazaId] = useState<number | ''>('')
    const [skladisteIzlazaId, setSkladisteIzlazaId] = useState<number | ''>('')
    const [transportId, setTransportId] = useState<number | ''>('')
    const [status, setStatus] = useState<StatusDokumenta>('NACRT')
    const [stavke, setStavke] = useState<StavkaRow[]>([newRow()])

    const slotoviUlaza = skladisteUlazaId !== ''
        ? slotovi.filter(s => s.sektor.skladiste.id === skladisteUlazaId)
        : []
    const slotoviIzlaza = skladisteIzlazaId !== ''
        ? slotovi.filter(s => s.sektor.skladiste.id === skladisteIzlazaId)
        : []

    const toDate = (val?: string | null) => val ? new Date(val) : null

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [stavkaError, setStavkaError] = useState<string | null>(null)

    const currentZaposleni = zaposlene.find(z => z.user === user?.id)

    useEffect(() => {
        if (!initialData && currentZaposleni) {
            setZaposleniId(currentZaposleni.id)
        }
    }, [currentZaposleni, initialData])

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

    useEffect(() => {
        if (initialData) {
            setTip(initialData.tip)
            setDatumVreme(toDate(initialData.datum_vreme))
            setPartnerId(initialData.poslovni_partner?.id ?? '')
            setZaposleniId(initialData.zaposleni.id)
            setSkladisteUlazaId(initialData.skladiste_ulaza?.id ?? '')
            setSkladisteIzlazaId(initialData.skladiste_izlaza?.id ?? '')
            setTransportId(initialData.transport?.id ?? '')
            setStatus(initialData.status)
            setStavke(
                initialData.stavke.length > 0
                    ? initialData.stavke.map(s => ({
                        tempId: ++_tempId,
                        proizvod: s.proizvod.id,
                        slot_ulaza: s.slot_ulaza?.id ?? '',
                        slot_izlaza: s.slot_izlaza?.id ?? '',
                        kolicina: s.kolicina,
                        cena: s.cena,
                    }))
                    : [newRow()]
            )
        } else {
            setTip('PRIJEMNICA')
            setDatumVreme(null)
            setPartnerId('')
            setZaposleniId('')
            setSkladisteUlazaId('')
            setSkladisteIzlazaId('')
            setTransportId('')
            setStatus('NACRT')
            setStavke([newRow()])
        }
    }, [initialData])

    const updateStavka = (tempId: number, field: keyof Omit<StavkaRow, 'tempId'>, value: number | '') => {
        setStavke(prev => prev.map(s => s.tempId === tempId ? { ...s, [field]: value } : s))
    }

    const resetSlotsUlaza = () => {
        setStavke(prev => prev.map(s => ({ ...s, slot_ulaza: '' as const })))
    }

    const resetSlotsIzlaza = () => {
        setStavke(prev => prev.map(s => ({ ...s, slot_izlaza: '' as const })))
    }

    const removeStavka = (tempId: number) => {
        setStavke(prev => prev.length > 1 ? prev.filter(s => s.tempId !== tempId) : prev)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (zaposleniId === '' || !datumVreme) return
        const validStavke = stavke.filter(s => s.proizvod !== '' && s.kolicina !== '' && s.cena !== '')
        if (validStavke.length === 0) return
        const stavkaBezSlota = validStavke.find(s => s.slot_ulaza === '' && s.slot_izlaza === '')
        if (stavkaBezSlota) {
            setStavkaError('Svaka stavka mora imati popunjen bar slot ulaza ili slot izlaza.')
            return
        }
        setStavkaError(null)
        onSubmit({
            tip,
            datum_vreme: datumVreme.toISOString(),
            poslovni_partner: partnerId === '' ? null : partnerId,
            zaposleni: zaposleniId,
            skladiste_ulaza: skladisteUlazaId === '' ? null : skladisteUlazaId,
            skladiste_izlaza: skladisteIzlazaId === '' ? null : skladisteIzlazaId,
            transport: transportId === '' ? null : transportId,
            status,
            stavke: validStavke.map(s => ({
                proizvod: s.proizvod as number,
                slot_ulaza: s.slot_ulaza === '' ? null : s.slot_ulaza as number,
                slot_izlaza: s.slot_izlaza === '' ? null : s.slot_izlaza as number,
                kolicina: s.kolicina as number,
                cena: s.cena as number,
            }))
        })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 bg-sidebar p-5 rounded-xl">
            {/* Zaglavlje dokumenta */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm text-sidebar-text">Tip dokumenta</label>
                    <select value={tip} onChange={e => setTip(e.target.value as TipDokumenta)} className={inputCls}>
                        <option className="bg-sidebar" value="PRIJEMNICA">Prijemnica</option>
                        <option className="bg-sidebar" value="POVRATNICA_K">Povratnica (kupac)</option>
                        <option className="bg-sidebar" value="OTPREMNICA">Otpremnica</option>
                        <option className="bg-sidebar" value="POVRATNICA_D">Povratnica (dobavljač)</option>
                        <option className="bg-sidebar" value="MEDJUSKLADISNICA">Međuskladišnica</option>
                        <option className="bg-sidebar" value="PRENOS">Prenos</option>
                        <option className="bg-sidebar" value="INVENTAR">Inventar</option>
                        <option className="bg-sidebar" value="OTPIS">Otpis</option>
                    </select>
                    {errors?.tip && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.tip}</p>}
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm text-sidebar-text">Datum i vreme</label>
                    <DatePicker
                        selected={datumVreme}
                        onChange={(date: Date | null) => setDatumVreme(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd.MM.yyyy HH:mm"
                        placeholderText="Izaberi datum i vreme..."
                        required
                        className={inputCls + " w-full"}
                        wrapperClassName="w-full"
                    />
                    {errors?.datum_vreme && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.datum_vreme}</p>}
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-sm text-sidebar-text">Zaposleni</label>
                    <div className={inputCls + " opacity-70 cursor-not-allowed"}>
                        {(() => {
                            const z = zaposlene.find(z => z.id === zaposleniId)
                            return z ? `${z.ime} ${z.prezime}` : (user ? `${user.ime} ${user.prezime}` : 'Učitavanje...')
                        })()}
                    </div>
                    {errors?.zaposleni && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.zaposleni}</p>}
                </div>

                <div className="col-span-2">
                    <SearchableSelect
                        label="Poslovni partner (opciono)"
                        options={partneri.map(p => ({ id: p.id, label: p.naziv }))}
                        value={partnerId}
                        onChange={setPartnerId}
                        placeholder="Pretraži partnere..."
                        error={errors?.poslovni_partner}
                    />
                </div>

                <SearchableSelect
                    label="Skladište ulaza (opciono)"
                    options={skladista.map(s => ({ id: s.id, label: s.naziv }))}
                    value={skladisteUlazaId}
                    onChange={val => { setSkladisteUlazaId(val); resetSlotsUlaza() }}
                    placeholder="Pretraži skladišta..."
                    error={errors?.skladiste_ulaza}
                />

                <SearchableSelect
                    label="Skladište izlaza (opciono)"
                    options={skladista.map(s => ({ id: s.id, label: s.naziv }))}
                    value={skladisteIzlazaId}
                    onChange={val => { setSkladisteIzlazaId(val); resetSlotsIzlaza() }}
                    placeholder="Pretraži skladišta..."
                    error={errors?.skladiste_izlaza}
                />

                <div className="col-span-2 flex items-end gap-2">
                    <div className="flex-1">
                        <SearchableSelect
                            label="Transport (opciono)"
                            options={transporti.map(t => ({ id: t.id, label: `#${t.id} — ${t.vozac ? `${t.vozac.ime} ${t.vozac.prezime}` : 'Bez vozača'}` }))}
                            value={transportId}
                            onChange={setTransportId}
                            placeholder="Pretraži transporte..."
                            error={errors?.transport}
                        />
                    </div>
                    <Button text="dodaj transport" variant="secondary" onClick={() => setIsAddOpen(true)} type="button" />
                </div>

                {errors?.form && (
                    <p className="col-span-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {errors.form}
                    </p>
                )}
            </div>

            <Modal isOpen={isAddOpen} title="Dodaj transport" onClose={() => setIsAddOpen(false)}>
                <TransportForm 
                    onSubmit={handleAdd}
                    onCancel={() => setIsAddOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {(stavkaError || errors?.stavke) && (
                <p className="text-sm text-red-500">{stavkaError || errors?.stavke}</p>
            )}

            {/* Stavke */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sidebar-text">Stavke dokumenta</span>
                    <button
                        type="button"
                        onClick={() => setStavke(prev => [...prev, newRow()])}
                        className="flex items-center gap-1 text-sm text-primary hover:opacity-80 transition-opacity"
                    >
                        <Plus size={15} /> Dodaj stavku
                    </button>
                </div>

                {stavke.map((stavka, idx) => (
                    <div key={stavka.tempId} className="border border-border rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-text-muted">Stavka {idx + 1}</span>
                            {stavke.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeStavka(stavka.tempId)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <SearchableSelect
                                    label="Proizvod"
                                    options={proizvodi.map(p => ({ id: p.id, label: `${p.naziv} (${p.barkod})` }))}
                                    value={stavka.proizvod}
                                    onChange={val => updateStavka(stavka.tempId, 'proizvod', val)}
                                    placeholder="Pretraži proizvode..."
                                    required
                                />
                            </div>

                            <SearchableSelect
                                label="Slot ulaza (opciono)"
                                options={slotoviUlaza.map(s => ({ id: s.id, label: `${s.naziv} - ${s.sektor.naziv}` }))}
                                value={stavka.slot_ulaza}
                                onChange={val => updateStavka(stavka.tempId, 'slot_ulaza', val)}
                                placeholder={skladisteUlazaId === '' ? 'Prvo izaberi skladište ulaza...' : 'Pretraži slotove...'}
                            />

                            <SearchableSelect
                                label="Slot izlaza (opciono)"
                                options={slotoviIzlaza.map(s => ({ id: s.id, label: `${s.naziv} - ${s.sektor.naziv}` }))}
                                value={stavka.slot_izlaza}
                                onChange={val => updateStavka(stavka.tempId, 'slot_izlaza', val)}
                                placeholder={skladisteIzlazaId === '' ? 'Prvo izaberi skladište izlaza...' : 'Pretraži slotove...'}
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-sidebar-text">Količina</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={stavka.kolicina}
                                    onChange={e => updateStavka(stavka.tempId, 'kolicina', e.target.value === '' ? '' : Number(e.target.value))}
                                    required
                                    className={inputCls}
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-sidebar-text">Cena (RSD)</label>
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={stavka.cena}
                                    onChange={e => updateStavka(stavka.tempId, 'cena', e.target.value === '' ? '' : Number(e.target.value))}
                                    required
                                    className={inputCls}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default DokumentForm