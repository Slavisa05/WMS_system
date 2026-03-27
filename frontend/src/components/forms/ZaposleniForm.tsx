import { useState, useEffect } from "react"
import type { Zaposleni } from "@/types/zaposleni"
import usePozicije from "@/hooks/usePozicije"
import Button from "../Button"
import FormInput from "./FormInput"
import SearchableSelect from "@/components/SearchableSelect"

interface ZaposleniFormProps {
    onSubmit: (data: { 
        ime: string, 
        prezime: string,
        jmbg: string,
        broj_telefona: string,
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
}

const ZaposleniForm = ({ onSubmit, onCancel, initialData, isLoading }: ZaposleniFormProps) => {
    const { pozicije } = usePozicije()
    const [ime, setIme] = useState('')
    const [prezime, setPrezime] = useState('')
    const [jmbg, setJmbg] = useState('')
    const [brojTelefona, setBrojTelefona] = useState('')
    const [datumZaposlenja, setDatumZaposlenja] = useState('')
    const [ugovorDo, setUgovorDo] = useState('')
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
            setDatumZaposlenja(initialData.datum_zaposlenja)
            setUgovorDo(initialData.ugovor_do ?? '')
            setPozicijaId(initialData.pozicija?.id ?? '')
        } else {
            setIme('')
            setPrezime('')
            setJmbg('')
            setBrojTelefona('')
            setDatumZaposlenja('')
            setUgovorDo('')
            setPozicijaId('')
            setUsername('')
            setPassword1('')
            setPassword2('')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pozicijaId === '') return
        onSubmit({
            ime, prezime, jmbg,
            broj_telefona: brojTelefona,
            datum_zaposlenja: datumZaposlenja,
            ugovor_do: ugovorDo || null,
            pozicija: pozicijaId,
            ...(!initialData && { username, password1, password2 }),
        })
    }

    const pozicijeOptions = pozicije.map(p => ({ id: p.id, label: p.naziv }))

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Ime" value={ime} onChange={setIme} placeholder="Ime" required />
                <FormInput label="Prezime" value={prezime} onChange={setPrezime} placeholder="Prezime" required />
                <FormInput label="JMBG" value={jmbg} onChange={setJmbg} placeholder="JMBG" required />
                <FormInput label="Broj telefona" value={brojTelefona} onChange={setBrojTelefona} placeholder="+381..." required />

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Datum zaposlenja</label>
                    <input
                        type="date"
                        value={datumZaposlenja}
                        onChange={e => setDatumZaposlenja(e.target.value)}
                        required
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-sidebar-text">Ugovor do <span className="text-text-muted">(opciono)</span></label>
                    <input
                        type="date"
                        value={ugovorDo}
                        onChange={e => setUgovorDo(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-border text-sm text-sidebar-text bg-sidebar focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="col-span-2">
                    <SearchableSelect
                        label="Pozicija"
                        options={pozicijeOptions}
                        value={pozicijaId}
                        onChange={setPozicijaId}
                        placeholder="Pretraži pozicije..."
                        required
                    />
                </div>
            </div>

            {!initialData && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <FormInput label="Korisničko ime" value={username} onChange={setUsername} placeholder="username" required />
                    </div>
                    <FormInput label="Lozinka" value={password1} onChange={setPassword1} placeholder="Lozinka" type="password" required />
                    <FormInput label="Potvrdi lozinku" value={password2} onChange={setPassword2} placeholder="Ponovi lozinku" type="password" required />
                </div>
            )}

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default ZaposleniForm