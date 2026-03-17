import { Link } from "react-router-dom";
import { Hash, Mail, MapPin, Phone, Tag } from "lucide-react";

interface PartneriCardProps {
    id: number;
    naziv: string;
    pib: string;
    email: string;
    adresa: string;
    telefon: string;
    tip: 'dobavljac' | 'kupac';
}

const PartneriCard = ({ id, naziv, pib, email, adresa, telefon, tip }: PartneriCardProps) => {
    return(
        <Link className="basis-[calc(25%-0.75rem)] min-w-56 grow" to={`/partneri/${id}`}>
            <div className="h-full cursor-pointer flex flex-col gap-3 px-5 py-4 bg-sidebar text-sidebar-text rounded-xl transition-all ease-out duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong className="text-lg">{naziv}</strong>
                <div className="flex flex-col gap-1.5 text-sm opacity-80">
                    <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />{pib}</p>
                    <p className="flex items-center gap-2"><Mail size={14} className="text-text-muted shrink-0" />{email}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-text-muted shrink-0" />{adresa}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-text-muted shrink-0" />{telefon}</p>
                    <p className="flex items-center gap-2"><Tag size={14} className="text-text-muted shrink-0" />{tip}</p>
                </div>
            </div>
        </Link>
    );
}

export default PartneriCard