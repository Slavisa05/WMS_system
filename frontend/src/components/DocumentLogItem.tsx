import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface DocumentLogItemProps {
    id: number;
    tip: 'PRIJEMNICA' | 'POVRATNICA_K' | 'OTPREMNICA' | 'POVRATNICA_D' | 'MEDJUSKLADISNICA' 
        | 'PRENOS' | 'INVENTAR' | 'OTPIS';
    status: 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN';
    datumVreme: string;
    zaposleni: string;
    poslovniPartner?: string;
}

const statusStyles: Record<DocumentLogItemProps['status'], string> = {
    'NA_CEKANJU': 'bg-amber-100 text-amber-700',
    'ODOBREN':    'bg-emerald-100 text-emerald-700',
    'ODBIJEN':    'bg-rose-100 text-rose-700',
};

const DocumentLogItem = ({ id, tip, status, datumVreme, zaposleni, poslovniPartner }: DocumentLogItemProps) => {
    return(
        <Link to={`/dokumenta/${id}`}>
            <div className="flex justify-between items-center w-full px-5 py-2.5 bg-sidebar text-sidebar-text rounded-xl transition-all ease-out duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <div className="flex gap-4 items-center">
                    <FileText size={18} className="shrink-0 scale-150 text-blue-500" aria-hidden="true" />

                    <div className="flex flex-col gap-2">
                        <strong>{tip} #{id}</strong>
                        <span className="text-sm text-text-muted">{zaposleni} · {datumVreme}{poslovniPartner ? ` · ${poslovniPartner}` : ''}</span>
                    </div>
                </div>
                <p className={`px-2.5 py-1 rounded-xl text-sm font-medium ${statusStyles[status]}`}>{status}</p>
            </div>
        </Link>
    );
}

export default DocumentLogItem