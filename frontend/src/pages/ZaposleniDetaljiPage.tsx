import { Hash, Phone, CalendarPlus, CalendarCheck, Briefcase, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateZaposleni, deleteZaposleni } from "@/api/zaposleni";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TransportLogItem from "@/components/TransportLogItem";
import useZaposleni from "@/hooks/useZaposleni";
import useVozila from "@/hooks/useVozila";
import useTransporti from "@/hooks/useTransporti";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";
import ZaposleniForm from "@/components/forms/ZaposleniForm";

const ZaposleniDetaljiPage = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { zaposleni, isLoading, error, refetch } = useZaposleni(Number(id));
    const { vozila } = useVozila();
    const { transporti } = useTransporti();

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEdit = async (data: { ime: string, prezime: string, jmbg: string, broj_telefona: string, datum_zaposlenja: string, ugovor_do: string | null, pozicija: number }) => {
        if (!zaposleni) return
        setIsSubmitting(true)
        try {
            await updateZaposleni(zaposleni.id, data)
            setIsEditOpen(false)
            refetch()
        } catch {
            alert('Greška pri izmeni zaposlenog')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!zaposleni) return
        setIsSubmitting(true)
        try {
            await deleteZaposleni(zaposleni.id)
            navigate(`/zaposleni`)     
        } catch {
            alert('Greška pri brisanju zaposlenog')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const vozilaZaposlenog = vozila.filter(v => v.zaduzeni_vozac.id === zaposleni?.id);
    const transportiZaposlenog = transporti.filter(t => t.vozac?.id === zaposleni?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji zaposlenog" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{zaposleni?.ime} {zaposleni?.prezime}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' onClick={() => setIsEditOpen(true)} />
                        <Button text='obriši' variant='secondary' onClick={() => setIsDeleteOpen(true)} />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />JMBG: {zaposleni?.jmbg}</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted shrink-0" />Broj telefona: {zaposleni?.broj_telefona}</p>
                <p className="flex items-center gap-2"><CalendarPlus size={16} className="text-text-muted shrink-0" />Datum zaposlenja: {zaposleni?.datum_zaposlenja}</p>
                <p className="flex items-center gap-2"><CalendarCheck size={16} className="text-text-muted shrink-0" />Ugovor do: {zaposleni?.ugovor_do ?? '/'}</p>
                <p className="flex items-center gap-2"><Briefcase size={16} className="text-text-muted shrink-0" />Pozicija: {zaposleni?.pozicija?.naziv}</p>
            </div>

            <div className="flex flex-col gap-2">
                <h2>Zaduzena Vozila</h2>
                {vozilaZaposlenog.map(v => (
                    <Link key={v.id} className="w-[50%]" to={`/vozila/${v.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                            <strong>{v.model}</strong>
                            <p>{v.registarski_broj}</p>
                            <ChevronRight />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <h2>Transporti</h2>
                {transportiZaposlenog.map(t => (
                    <TransportLogItem key={t.id} {...t} />
                ))}
            </div>

            <Modal isOpen={isEditOpen} title="Izmeni zaposlenog" onClose={() => setIsEditOpen(false)}>
                <ZaposleniForm
                    initialData={zaposleni}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditOpen(false)}
                    isLoading={isSubmitting}
                />
            </Modal>

            {/* Modal za brisanje */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Izbriši zaposlenog"
                message={`Da li ste sigurni da želite da izbrišete zaposlenog "${zaposleni?.ime} ${zaposleni?.prezime}"?`}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
                isLoading={isSubmitting}
            />
        </section>
    );
}

export default ZaposleniDetaljiPage