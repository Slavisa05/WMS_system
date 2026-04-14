import { useState, useEffect } from "react"
import type { Slot } from "@/types/skladiste"
import Button from "../Button"
import FormInput from "./FormInput"

export interface SlotFormErrors {
    naziv?: string
    kapacitet?: string
    form?: string
}

interface SlotFormProps {
    onSubmit: (data: { naziv: string, kapacitet: number }) => void
    onCancel: () => void
    initialData?: Slot | null
    isLoading?: boolean
    errors?: SlotFormErrors
}

const SlotForm = ({ onSubmit, onCancel, initialData, isLoading, errors }: SlotFormProps) => {
    const [naziv, setNaziv] = useState('')
    const [kapacitet, setKapacitet] = useState('')

    useEffect(() => {
        if (initialData) {
            setNaziv(initialData.naziv)
            setKapacitet(String(initialData.kapacitet))
        } else {
            setNaziv('')
            setKapacitet('')
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ naziv, kapacitet: Number(kapacitet) })
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
                label="Naziv"
                value={naziv}
                onChange={setNaziv}
                placeholder="Naziv slota"
                required
                error={errors?.naziv}
            />
            <FormInput
                label="Kapacitet"
                value={kapacitet}
                onChange={setKapacitet}
                placeholder="Kapacitet"
                type="number"
                required
                error={errors?.kapacitet}
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

export default SlotForm