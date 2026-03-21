import { Link } from "react-router-dom";
import { CalendarCheck, Briefcase } from "lucide-react";
import type { Zaposleni } from "@/types/zaposleni"; 

const ZaposleniCard = ({ id, ime, prezime, ugovor_do, pozicija }: Zaposleni) => {
    return(
        <Link className="w-[32%]" to={`/zaposleni/${id}`}>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong>{ime} {prezime}</strong>
                <p className="flex items-center gap-2 text-sm"><CalendarCheck size={14} className="text-text-muted shrink-0" />Ugovor do: {ugovor_do ?? '/'}</p>
                <p className="flex items-center gap-2 text-sm"><Briefcase size={14} className="text-text-muted shrink-0" />Pozicija: {pozicija?.naziv ?? '/'}</p>
            </div>
        </Link>
    );
}

export default ZaposleniCard