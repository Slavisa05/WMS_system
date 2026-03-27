import { useState, useEffect } from "react"
import type { Proizvod } from "@/types/inventar"
import useKategorije from "@/hooks/useKategorije"
import Button from "../Button"
import FormInput from "./FormInput"

interface ProizvodFormProps {
    onSubmit: (data: { 
        naziv: string, 
        barkod: string,
        sifra: string,
        jedinica_mere: 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol',
        kategorija: number,
    }) => void
    onCancel: () => void
    initialData?: Proizvod | null
    isLoading?: boolean
}

const ProizvodForm = ({ onSubmit, onCancel, initialData, isLoading }: ProizvodFormProps) => {
    const { kategorije } = useKategorije()
    const [naziv, setNaziv] = useState('')
    const [barkod, setBarkod] = useState('')
    const [sifra, setSifra] = useState('')
    const [jedinicaMere, setJedinicaMere] = useState<'g' | 'kg' | 't' | 'ml' | 'l' | 'kol'>('kol')
    const [kategorijaId, setKategorijaId] = useState<number | ''>('')

    useEffect(() => {
        if (initialData) {
            setNaziv(initialData.naziv)
            setBarkod(initialData.barkod)
            setSifra(initialData.sifra)
            setJedinicaMere(initialData.jedinica_mere)
            setKategorijaId(initialData.kategorija.id)
        } else {
            setNaziv('')
            setBarkod('')
            setSifra('')
            setJedinicaMere('kol')
            setKategorijaId(kategorije[0]?.id ?? '')
        }
    }, [initialData, kategorije])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (kategorijaId === '') return
        onSubmit({ naziv, barkod, sifra, jedinica_mere: jedinicaMere, kategorija: kategorijaId })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput label="Naziv" value={naziv} onChange={setNaziv} placeholder="Naziv proizvoda" required />
            <FormInput label="Barkod" value={barkod} onChange={setBarkod} placeholder="Barkod" required />
            <FormInput label="Šifra" value={sifra} onChange={setSifra} placeholder="Šifra" required />

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Jedinica mere</label>
                <select
                    value={jedinicaMere}
                    onChange={e => setJedinicaMere(e.target.value as 'g' | 'kg' | 't' | 'ml' | 'l' | 'kol')}
                    className="px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
                >
                    <option className="bg-sidebar text-sidebar-text" value="g">g</option>
                    <option className="bg-sidebar text-sidebar-text" value="kg">kg</option>
                    <option className="bg-sidebar text-sidebar-text" value="t">t</option>
                    <option className="bg-sidebar text-sidebar-text" value="ml">ml</option>
                    <option className="bg-sidebar text-sidebar-text" value="l">l</option>
                    <option className="bg-sidebar text-sidebar-text" value="kol">kol</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-sidebar-text">Kategorija</label>
                <select
                    value={kategorijaId}
                    onChange={e => setKategorijaId(Number(e.target.value))}
                    required
                    className="px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
                >
                    {kategorije.map(k => (
                        <option key={k.id} className="bg-sidebar text-sidebar-text" value={k.id}>
                            {k.naziv}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default ProizvodForm