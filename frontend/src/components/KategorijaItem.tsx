import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Kategorija } from "@/types/inventar";

const KategorijaItem = ({ id, naziv, broj_proizvoda_ukupno }: Kategorija) => {
    return(
        <Link className="w-[32%]" to={`/kategorije/${id}`}>
            <div className="cursor-pointer flex justify-between items-center w-full px-5 py-2.5 bg-sidebar text-sidebar-text rounded-xl transition-all ease-out duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong className="text-xl">{naziv}</strong>
                <p className="opacity-80 text-sm">Broj Proizvoda: {broj_proizvoda_ukupno}</p>
                <ChevronRight size={16} className="shrink-0 opacity-60" />
            </div>
        </Link>
    );
}

export default KategorijaItem