import { AlertCircle, AlertTriangle, Info, ChevronRight } from "lucide-react";

interface ObavestenjeProps {
    link: string;
    tekst: string;
    status: 'KRITICNO' | 'UPOZORENJE' | 'INFO';
}

const statusStyles: Record<ObavestenjeProps['status'], string> = {
    'KRITICNO':   'bg-rose-100 text-rose-700',
    'UPOZORENJE': 'bg-amber-100 text-amber-700',
    'INFO':       'bg-blue-100 text-blue-700',
};

const statusIcons = {
    'KRITICNO':   <AlertCircle size={18} className="shrink-0" />,
    'UPOZORENJE': <AlertTriangle size={18} className="shrink-0" />,
    'INFO':       <Info size={18} className="shrink-0" />,
};

const Obavestenje = ({ link, tekst, status }: ObavestenjeProps) => {
    return(
        <div className={`cursor-pointer w-[50%] rounded-xl px-4 py-3 flex items-center gap-3 ${statusStyles[status]}`}>
            {statusIcons[status]}
            <a href={link} className="flex-1 text-sm font-medium">{tekst}</a>
            <ChevronRight size={16} className="shrink-0 opacity-60" />
        </div>
    );
}

export default Obavestenje
