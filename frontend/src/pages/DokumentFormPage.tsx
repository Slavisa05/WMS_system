import { useState } from "react"
import { createDokument, updateDokument } from "@/api/dokument"
import { useParams, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import useDokument from "@/hooks/useDokument"
import DokumentForm from "@/components/forms/DokumentForm"

type TipDokumenta = 'PRIJEMNICA' | 'POVRATNICA_K' | 'OTPREMNICA' | 'POVRATNICA_D' | 'MEDJUSKLADISNICA' | 'PRENOS' | 'INVENTAR' | 'OTPIS'
type StatusDokumenta = 'NACRT' | 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN'

interface StavkaPayload {
    proizvod: number
    slot_ulaza: number | null
    slot_izlaza: number | null
    kolicina: number
    cena: number
}

const DokumentFormPage = () => {
    const { id } = useParams()
    const isEdit = !!id
    const { dokument, isLoading } = useDokument(isEdit ? Number(id) : null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleCancel = () => {
        navigate(-1)
    }

    const handleForm = async (data: { tip: TipDokumenta, datum_vreme: string, poslovni_partner: number | null, zaposleni: number, skladiste_ulaza: number | null, skladiste_izlaza: number | null,  transport: number | null, status: StatusDokumenta, stavke: StavkaPayload[] }) => {
        setIsSubmitting(true)
        try {
            if (isEdit && dokument) {
                await updateDokument(dokument.id, data)
            } else {
                await createDokument(data)
            }
            navigate(-1)
        } catch {
            alert(isEdit ? 'Greška pri izmeni dokumenta' : 'Greška pri dodavanju dokumenta')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isEdit && isLoading) return 'Loading...';

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading={isEdit ? "Izmeni dokument" : "Dodaj dokument"} />
            
            <DokumentForm 
                onSubmit={handleForm}
                onCancel={() => handleCancel()}
                isLoading={isSubmitting}
                initialData={dokument}
            />
        </section>
    )
}

export default DokumentFormPage