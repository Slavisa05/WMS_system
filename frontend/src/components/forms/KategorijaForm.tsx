import { useState, useEffect } from 'react'
import type { Kategorija } from '@/types/inventar'
import Button from '@/components/Button'
import FormInput from '@/components/forms/FormInput'

export interface KategorijaFormErrors {
    naziv?: string
    form?: string
}

interface KategorijaFormProps {
    onSubmit: (data: { naziv: string }) => void
    onCancel: () => void
    initialData?: Kategorija | null  
    isLoading?: boolean
    errors?: KategorijaFormErrors
}

const KategorijaForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: KategorijaFormProps) => {
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
                label="Naziv"
                value={naziv}
                onChange={setNaziv}
                placeholder="Naziv kategorije"
                required
                            error={errors?.naziv}
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

export default KategorijaForm