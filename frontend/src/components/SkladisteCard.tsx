import MainButton from "./Button";
import { Link } from 'react-router-dom'
import type { Skladiste } from "@/types/skladiste";

const SkladisteCard = ({ id, naziv, adresa, tip }: Skladiste) => {
    return(
        <div className="basis-[calc(25%-0.75rem)] min-w-50 grow px-5 py-3 flex flex-col gap-3 bg-sidebar text-sidebar-text rounded-xl transition-all duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
            <strong className="text-xl">{naziv}</strong>
            <p>Adresa: {adresa}</p>
            <p>Tip: {tip}</p>

            <div className="flex items-center gap-2">
                <Link to={`/skladista/${id}`}>
                    <MainButton text="detalji" />
                </Link>
            </div>
        </div>
    );
}

export default SkladisteCard