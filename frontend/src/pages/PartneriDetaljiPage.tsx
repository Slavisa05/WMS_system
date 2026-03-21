import { Hash, Mail, MapPin, Phone, Tag } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";
import usePartner from "@/hooks/usePartner";
import useDokumenta from "@/hooks/useDokumenta";

const PartneriDetaljiPage = () => {
    const { id } = useParams()
    const { partner, isLoading, error } = usePartner(Number(id))
    const { dokumenta } = useDokumenta()

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const dokumentaPartnera = dokumenta.filter(d => d.poslovni_partner?.id === partner?.id)

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Poslovni Partner" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{partner?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />PIB: {partner?.pib}</p>
                <p className="flex items-center gap-2"><Mail size={16} className="text-text-muted shrink-0" />email: {partner?.email}</p>
                <p className="flex items-center gap-2"><MapPin size={16} className="text-text-muted shrink-0" />Adresa: {partner?.adresa}</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted shrink-0" />Telefon: {partner?.telefon}</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted shrink-0" />Tip: {partner?.tip}</p>
            </div>

            <div className="flex flex-col w-full gap-4">
                <h2>Dokumenti sa ovim partnerom</h2>
                
                {dokumentaPartnera.map(d => (
                    <DocumentLogItem key={d.id} {...d} />
                ))}
            </div>
        </section>
    );
}

export default PartneriDetaljiPage