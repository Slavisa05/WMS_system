import { useState, useEffect } from "react"
import type { Sektor } from "@/types/skladiste"
import Button from "../Button"
import FormInput from "./FormInput"

export interface SektorFormErrors {
    naziv?: string
    form?: string
}

interface SektorFormProps {
    onSubmit: (data: { naziv: string }) => void
    onCancel: () => void
    initialData?: Sektor | null
    isLoading?: boolean
    errors?: SektorFormErrors
}

const SektorForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: SektorFormProps) => {
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
            <FormInput label="Naziv" value={naziv} onChange={setNaziv} placeholder="Naziv sektora" required error={errors?.naziv} />

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

export default SektorForm