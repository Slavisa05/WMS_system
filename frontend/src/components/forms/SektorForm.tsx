import { useState, useEffect } from "react"
import type { Sektor } from "@/types/skladiste"
import Button from "../Button"
import FormInput from "./FormInput"

interface SektorFormProps {
    onSubmit: (data: { naziv: string }) => void
    onCancel: () => void
    initialData?: Sektor | null
    isLoading?: boolean
}

const SektorForm = ({ onSubmit, onCancel, initialData, isLoading }: SektorFormProps) => {
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
            <FormInput label="Naziv" value={naziv} onChange={setNaziv} placeholder="Naziv sektora" required />

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default SektorForm