import { Hash, Mail, MapPin, Phone, Tag } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import DocumentLogItem from "@/components/DocumentLogItem";

interface Partneri {
    id: number;
    naziv: string;
    pib: string;
    email: string;
    adresa: string;
    telefon: string;
    tip: 'dobavljac' | 'kupac';
}

const PartneriDetaljiPage = () => {
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="IDEA" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>IDEA</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />PIB: 123456789</p>
                <p className="flex items-center gap-2"><Mail size={16} className="text-text-muted shrink-0" />email: idea@gmail.com</p>
                <p className="flex items-center gap-2"><MapPin size={16} className="text-text-muted shrink-0" />Adresa: Prvog Maja 61, Ub 14210</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-text-muted shrink-0" />Telefon: 0640811781</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted shrink-0" />Tip: dobavljac</p>
            </div>

            <div className="flex flex-col w-full gap-4">
                <h2>Dokumenti sa ovim partnerom</h2>
                
                <DocumentLogItem id={1234} tip="PRIJEMNICA" datumVreme="11/03/2026 12:25:30h" status="ODOBREN" zaposleni="Marko Markovic" />
                <DocumentLogItem id={2245} tip="POVRATNICA_K" datumVreme="19/10/2025 19:00:00h" status="NA_CEKANJU" zaposleni="Mirko Mirkovic" />
            </div>
        </section>
    );
}

export default PartneriDetaljiPage