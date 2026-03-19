import { Link } from "react-router-dom";
import { Hash, CalendarCheck, Wrench, User } from "lucide-react";

interface VoziloCardProps {
    id: number;
    model: string;
    registarskiBroj: string;
    datumRegistracije: string;
    poslednjiTehnicki: string;
    zaduzeniVozac: string;
}

const VoziloCard = ({ id, model, registarskiBroj, datumRegistracije, poslednjiTehnicki, zaduzeniVozac }: VoziloCardProps) => {
    return(
        <Link className="w-[32%]" to={`/vozila/${id}`}>
            <div className="flex flex-col gap-2 w-full p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong className="text-lg">{model}</strong>
                <div className="flex flex-col gap-1.5 text-sm opacity-80">
                    <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />Registarski broj: {registarskiBroj}</p>
                    <p className="flex items-center gap-2"><CalendarCheck size={14} className="text-text-muted shrink-0" />Datum registracije: {datumRegistracije}</p>
                    <p className="flex items-center gap-2"><Wrench size={14} className="text-text-muted shrink-0" />Poslednji tehnički: {poslednjiTehnicki}</p>
                    <p className="flex items-center gap-2"><User size={14} className="text-text-muted shrink-0" />Zaduženi vozač: {zaduzeniVozac}</p>
                </div>
            </div>
        </Link>
    );
}

export default VoziloCard