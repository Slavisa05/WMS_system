import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { Zaposleni } from "@/types/zaposleni"
import usePozicije from "@/hooks/usePozicije"
import Button from "../Button"
import FormInput from "./FormInput"
import SearchableSelect from "@/components/SearchableSelect"

export interface ZaposleniFormErrors {
    ime?: string
    prezime?: string
    jmbg?: string
    broj_telefona?: string
    datum_rodjenja?: string
    datum_zaposlenja?: string
    ugovor_do?: string
    pozicija?: string
    username?: string
    password1?: string
    password2?: string
    form?: string
}

interface ZaposleniFormProps {
    onSubmit: (data: { 
        ime: string, 
        prezime: string,
        jmbg: string,
        broj_telefona: string,
        datum_rodjenja: string,
        datum_zaposlenja: string,
        ugovor_do: string | null,
        pozicija: number,
        username?: string,
        password1?: string,
        password2?: string,
    }) => void
    onCancel: () => void
    initialData?: Zaposleni | null
    isLoading?: boolean
    errors?: ZaposleniFormErrors
}

const ZaposleniForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: ZaposleniFormProps) => {
    const { pozicije } = usePozicije()
    const [ime, setIme] = useState('')
    const [prezime, setPrezime] = useState('')
    const [jmbg, setJmbg] = useState('')
    const [brojTelefona, setBrojTelefona] = useState('')
    const [datumRodjenja, setDatumRodjenja] = useState<Date | null>(null)
    const [datumZaposlenja, setDatumZaposlenja] = useState<Date | null>(null)
    const [ugovorDo, setUgovorDo] = useState<Date | null>(null)
    const [pozicijaId, setPozicijaId] = useState<number | ''>('')
    const [username, setUsername] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')

    useEffect(() => {
        if (initialData) {
            setIme(initialData.ime)
            setPrezime(initialData.prezime)
            setJmbg(initialData.jmbg)
            setBrojTelefona(initialData.broj_telefona)
            setDatumRodjenja(initialData.datum_rodjenja ? new Date(initialData.datum_rodjenja) : null)
            setDatumZaposlenja(initialData.datum_zaposlenja ? new Date(initialData.datum_zaposlenja) : null)
            setUgovorDo(initialData.ugovor_do ? new Date(initialData.ugovor_do) : null)
            setPozicijaId(initialData.pozicija?.id ?? '')
        } else {
            setIme('')
            setPrezime('')
            setJmbg('')
            setBrojTelefona('')
            setDatumRodjenja(null)
            setDatumZaposlenja(null)
            setUgovorDo(null)
            setPozicijaId('')
            setUsername('')
            setPassword1('')
            setPassword2('')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pozicijaId === '' || !datumZaposlenja || !datumRodjenja) return
        onSubmit({
            ime, prezime, jmbg,
            broj_telefona: brojTelefona,
            datum_rodjenja: datumRodjenja.toISOString().split('T')[0],
            datum_zaposlenja: datumZaposlenja.toISOString().split('T')[0],
            ugovor_do: ugovorDo ? ugovorDo.toISOString().split('T')[0] : null,
            pozicija: pozicijaId,
            ...(!initialData && { username, password1, password2 }),
        })
    }

    const pozicijeOptions = pozicije.map(p => ({ id: p.id, label: p.naziv }))

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Ime" value={ime} onChange={setIme} placeholder="Ime" required error={errors?.ime} />
                <FormInput label="Prezime" value={prezime} onChange={setPrezime} placeholder="Prezime" required error={errors?.prezime} />
                <FormInput label="JMBG" value={jmbg} onChange={setJmbg} placeholder="JMBG" required error={errors?.jmbg} />
                <FormInput label="Broj telefona" value={brojTelefona} onChange={setBrojTelefona} placeholder="+381..." required error={errors?.broj_telefona} />

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum rodjenja</label>
                    <DatePicker
                        selected={datumRodjenja}
                        onChange={(date: Date | null) => setDatumRodjenja(date)}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Izaberi datum..."
                        required
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                        wrapperClassName="w-full"
                    />
                    {errors?.datum_rodjenja && <p className="text-xs text-red-500">{errors.datum_rodjenja}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum zaposlenja</label>
                    <DatePicker
                        selected={datumZaposlenja}
                        onChange={(date: Date | null) => setDatumZaposlenja(date)}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Izaberi datum..."
                        required
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                        wrapperClassName="w-full"
                    />
                    {errors?.datum_zaposlenja && <p className="text-xs text-red-500">{errors.datum_zaposlenja}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Ugovor do <span className="text-text-muted">(opciono)</span></label>
                    <DatePicker
                        selected={ugovorDo}
                        onChange={(date: Date | null) => setUgovorDo(date)}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Izaberi datum..."
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary w-full"
                        wrapperClassName="w-full"
                    />
                    {errors?.ugovor_do && <p className="text-xs text-red-500">{errors.ugovor_do}</p>}
                </div>

                <div className="col-span-2">
                    <SearchableSelect
                        label="Pozicija"
                        options={pozicijeOptions}
                        value={pozicijaId}
                        onChange={setPozicijaId}
                        placeholder="Pretraži pozicije..."
                        required
                        error={errors?.pozicija}
                    />
                </div>
            </div>

            {!initialData && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <FormInput label="Korisničko ime" value={username} onChange={setUsername} placeholder="username" required error={errors?.username} />
                    </div>
                    <FormInput label="Lozinka" value={password1} onChange={setPassword1} placeholder="Lozinka" type="password" required error={errors?.password1} />
                    <FormInput label="Potvrdi lozinku" value={password2} onChange={setPassword2} placeholder="Ponovi lozinku" type="password" required error={errors?.password2} />
                </div>
            )}

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

export default ZaposleniForm