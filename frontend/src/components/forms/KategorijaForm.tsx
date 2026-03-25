import { useState, useEffect } from 'react'
import type { Kategorija } from '@/types/inventar'
import Button from '@/components/Button'
import FormInput from '@/components/forms/FormInput'

interface KategorijaFormProps {
    onSubmit: (data: { naziv: string }) => void
    onCancel: () => void
    initialData?: Kategorija | null  
    isLoading?: boolean
}

const KategorijaForm = ({ onSubmit, onCancel, initialData, isLoading }: KategorijaFormProps) => {
    const [naziv, setNaziv] = useState('')

    useEffect(() => {
        if (initialData) {
            setNaziv(initialData.naziv)
        } else {
            setNaziv('')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ naziv })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput
                label="Naziv"
                value={naziv}
                onChange={setNaziv}
                placeholder="Naziv kategorije"
                required
            />

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default KategorijaForm