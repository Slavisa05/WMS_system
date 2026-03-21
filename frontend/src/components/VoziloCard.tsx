import { Link } from "react-router-dom";
import { Hash, CalendarCheck, Wrench, User } from "lucide-react";
import type { Vozilo } from "@/types/transport";

const VoziloCard = ({ id, model, registarski_broj, datum_registracije, poslednji_tehnicki, zaduzeni_vozac }: Vozilo) => {
    return(
        <Link className="w-[32%]" to={`/vozila/${id}`}>
            <div className="flex flex-col gap-2 w-full p-4 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong className="text-lg">{model}</strong>
                <div className="flex flex-col gap-1.5 text-sm opacity-80">
                    <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />Registarski broj: {registarski_broj}</p>
                    <p className="flex items-center gap-2"><CalendarCheck size={14} className="text-text-muted shrink-0" />Datum registracije: {datum_registracije}</p>
                    <p className="flex items-center gap-2"><Wrench size={14} className="text-text-muted shrink-0" />Poslednji tehnički: {poslednji_tehnicki}</p>
                    <p className="flex items-center gap-2"><User size={14} className="text-text-muted shrink-0" />Zaduženi vozač: {zaduzeni_vozac.ime} {zaduzeni_vozac.prezime}</p>
                </div>
            </div>
        </Link>
    );
}

export default VoziloCard