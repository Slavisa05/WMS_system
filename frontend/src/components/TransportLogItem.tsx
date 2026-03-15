import { Truck } from "lucide-react";

interface Vozilo {
    model: string;
    registarskiBroj: string;
}

interface TransportLogItemProps {
    vozilo: Vozilo;
    vozac: string;
    polazak: string;
    dolazak?: string;
    status: 'ZAKAZANO' | 'U_TOKU' | 'ZAVRSENO' | 'OTKAZANO' | 'NEUSPESNO';
}

const statusStyles: Record<TransportLogItemProps['status'], string> = {
    'ZAKAZANO':  'bg-blue-100 text-blue-700',
    'U_TOKU':    'bg-amber-100 text-amber-700',
    'ZAVRSENO':  'bg-emerald-100 text-emerald-700',
    'OTKAZANO':  'bg-rose-100 text-rose-700',
    'NEUSPESNO': 'bg-gray-100 text-gray-600',
};

const TransportLogItem = ({ vozilo, vozac, polazak, dolazak, status }: TransportLogItemProps) => {
    return(
        <div className="flex justify-between items-center w-full px-5 py-2.5 bg-sidebar text-sidebar-text rounded-xl transition-all ease-out duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
            <div className="flex gap-4 items-center">
                <Truck size={18} className="shrink-0 scale-150 text-orange-500" aria-hidden="true" />

                <div className="flex flex-col gap-2">
                    <strong>{vozilo.registarskiBroj} · {vozilo.model}</strong>
                    <span className="text-sm text-text-muted">Vozač: {vozac} · {polazak}{dolazak ? ` · ${dolazak}` : ''}</span>
                </div>
            </div>
            <p className={`px-2.5 py-1 rounded-xl text-sm font-medium ${statusStyles[status]}`}>{status}</p>
        </div>
    );
}

export default TransportLogItem