import { Link } from "react-router-dom";
import { CalendarCheck, Briefcase } from "lucide-react";

interface ZaposleniCardProps {
    id: number;
    ime: string;
    prezime: string;
    ugovorDo: string;
    pozicija: 'Zaposleni' | 'Menadzer' | 'Admin';
} 

const ZaposleniCard = ({ id, ime, prezime, ugovorDo, pozicija }: ZaposleniCardProps) => {
    return(
        <Link className="w-[32%]" to={`/zaposleni/${id}`}>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong>{ime} {prezime}</strong>
                <p className="flex items-center gap-2 text-sm"><CalendarCheck size={14} className="text-text-muted shrink-0" />Ugovor do: {ugovorDo}</p>
                <p className="flex items-center gap-2 text-sm"><Briefcase size={14} className="text-text-muted shrink-0" />Pozicija: {pozicija}</p>
            </div>
        </Link>
    );
}

export default ZaposleniCard