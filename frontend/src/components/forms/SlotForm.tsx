import { useState, useEffect } from "react"
import type { Slot } from "@/types/skladiste"
import Button from "../Button"
import FormInput from "./FormInput"

interface SlotFormProps {
    onSubmit: (data: { naziv: string, kapacitet: number }) => void
    onCancel: () => void
    initialData?: Slot | null
    isLoading?: boolean
}

const SlotForm = ({ onSubmit, onCancel, initialData, isLoading }: SlotFormProps) => {
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput label="Naziv" value={naziv} onChange={setNaziv} placeholder="Naziv slota" required />
            <FormInput label="Kapacitet" value={kapacitet} onChange={setKapacitet} placeholder="Kapacitet" type="number" required />

            <div className="flex justify-end gap-2">
                <Button text="Odustani" onClick={onCancel} variant="secondary" type="button" />
                <Button text={initialData ? 'Sačuvaj' : 'Dodaj'} type="submit" isLoading={isLoading} />
            </div>
        </form>
    )
}

export default SlotForm