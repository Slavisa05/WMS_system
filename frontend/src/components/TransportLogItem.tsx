import { Truck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Transport } from "@/types/transport";

const statusStyles: Record<Transport['status'], string> = {
    'ZAKAZANO':  'bg-blue-100 text-blue-700',
    'U_TOKU':    'bg-amber-100 text-amber-700',
    'ZAVRSENO':  'bg-emerald-100 text-emerald-700',
    'OTKAZANO':  'bg-rose-100 text-rose-700',
    'NEUSPESNO': 'bg-gray-100 text-gray-600',
};

const TransportLogItem = ({ id, vozilo, vozac, datum_polaska, datum_zavrsetka, status, napomena }: Transport) => {
    return(
        <Link to={`/transporti/${id}`}>
            <div className="flex justify-between items-center w-full px-5 py-2.5 bg-sidebar text-sidebar-text rounded-xl transition-all ease-out duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <div className="flex gap-4 items-center">
                    <Truck size={18} className="shrink-0 scale-150 text-orange-500" aria-hidden="true" />

                    <div className="flex flex-col gap-2">
                        <strong>{vozilo.registarski_broj} · {vozilo.model}</strong>
                        <span className="text-sm text-text-muted">Vozač: {vozac?.ime} {vozac?.prezime} · {datum_polaska}{datum_zavrsetka ? ` · ${datum_zavrsetka}` : ''}</span>
                    </div>
                </div>
                <p className={`px-2.5 py-1 rounded-xl text-sm font-medium ${statusStyles[status]}`}>{status}</p>
            </div>
        </Link>
    );
}

export default TransportLogItem