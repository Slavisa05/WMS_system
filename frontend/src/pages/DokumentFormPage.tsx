import { useState } from "react"
import { createDokument, updateDokument } from "@/api/dokument"
import { useParams, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import useDokument from "@/hooks/useDokument"
import DokumentForm, { type DokumentFormErrors } from "@/components/forms/DokumentForm"
import { useAuth } from "@/context/AuthContext"

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
    const [dokumentErrors, setDokumentErrors] = useState<DokumentFormErrors>({})
    const navigate = useNavigate()
    const { user, isMenadzer } = useAuth()

    const getFirstErrorMessage = (value: unknown): string | undefined => {
        if (Array.isArray(value)) {
            for (const item of value) {
                const nestedMessage = getFirstErrorMessage(item)
                if (nestedMessage) {
                    return nestedMessage
                }
            }
            return undefined
        }

        if (value && typeof value === 'object') {
            for (const nestedValue of Object.values(value as Record<string, unknown>)) {
                const nestedMessage = getFirstErrorMessage(nestedValue)
                if (nestedMessage) {
                    return nestedMessage
                }
            }
            return undefined
        }

        return typeof value === 'string' ? value : undefined
    }

    const parseDokumentErrors = (err: any): DokumentFormErrors => {
        const data = err?.response?.data
        if (!data || typeof data !== 'object') {
            return { form: isEdit ? 'Greška pri izmeni dokumenta' : 'Greška pri dodavanju dokumenta' }
        }

        const fieldErrors: DokumentFormErrors = {
            tip: getFirstErrorMessage(data.tip),
            datum_vreme: getFirstErrorMessage(data.datum_vreme),
            poslovni_partner: getFirstErrorMessage(data.poslovni_partner),
            zaposleni: getFirstErrorMessage(data.zaposleni),
            skladiste_ulaza: getFirstErrorMessage(data.skladiste_ulaza),
            skladiste_izlaza: getFirstErrorMessage(data.skladiste_izlaza),
            transport: getFirstErrorMessage(data.transport),
            status: getFirstErrorMessage(data.status),
            stavke: getFirstErrorMessage(data.stavke),
            form: getFirstErrorMessage(data.detail) || getFirstErrorMessage(data.non_field_errors),
        }

        if (!fieldErrors.tip && !fieldErrors.datum_vreme && !fieldErrors.poslovni_partner && !fieldErrors.zaposleni && !fieldErrors.skladiste_ulaza && !fieldErrors.skladiste_izlaza && !fieldErrors.transport && !fieldErrors.status && !fieldErrors.stavke && !fieldErrors.form) {
            fieldErrors.form = isEdit ? 'Greška pri izmeni dokumenta' : 'Greška pri dodavanju dokumenta'
        }

        return fieldErrors
    }

    const handleCancel = () => {
        navigate(-1)
    }

    const handleForm = async (data: { tip: TipDokumenta, datum_vreme: string, poslovni_partner: number | null, zaposleni: number, skladiste_ulaza: number | null, skladiste_izlaza: number | null,  transport: number | null, status: StatusDokumenta, stavke: StavkaPayload[] }) => {
        setIsSubmitting(true)
        setDokumentErrors({})
        try {
            if (isEdit && dokument) {
                await updateDokument(dokument.id, data)
            } else {
                await createDokument(data)
            }
            navigate(-1)
        } catch (err: any) {
            setDokumentErrors(parseDokumentErrors(err))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isEdit && isLoading) return 'Loading...';

    if (isEdit && dokument) {
        const isKreator = dokument.zaposleni.user === user?.id
        if (!isMenadzer && !isKreator) {
            return (
                <section className="pr-[5%] flex flex-col gap-10">
                    <Header heading="Izmeni dokument" />
                    <p className="text-sm text-red-500">Nemate dozvolu da menjate ovaj dokument.</p>
                </section>
            )
        }
    }

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading={isEdit ? "Izmeni dokument" : "Dodaj dokument"} />
            
            <DokumentForm 
                onSubmit={handleForm}
                onCancel={() => handleCancel()}
                isLoading={isSubmitting}
                initialData={dokument}
                errors={dokumentErrors}
            />
        </section>
    )
}

export default DokumentFormPage