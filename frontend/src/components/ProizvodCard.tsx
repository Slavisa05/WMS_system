import { Link } from "react-router-dom";
import { Barcode, Hash, Ruler, Tag } from "lucide-react";

interface ProizvodCardProps {
    id: number;
    naziv: string;
    barkod: string;
    sifra: string;
    jedinica_mere: string;
    kategorija: string;
}

const ProizvodCard = ({ id, naziv, barkod, sifra, jedinica_mere, kategorija }: ProizvodCardProps) => {
    return(
        <Link className="basis-[calc(25%-0.75rem)] min-w-56 grow" to={`/proizvodi/${id}`}>
            <div className="h-full cursor-pointer flex flex-col gap-3 px-5 py-4 bg-sidebar text-sidebar-text rounded-xl transition-all ease-out duration-300 hover:transform-[translateY(-5px)] hover:bg-sidebar-hover">
                <strong className="text-lg">{naziv}</strong>
                <div className="flex flex-col gap-1.5 text-sm opacity-80">
                    <p className="flex items-center gap-2"><Barcode size={14} className="text-text-muted shrink-0" />{barkod}</p>
                    <p className="flex items-center gap-2"><Hash size={14} className="text-text-muted shrink-0" />{sifra}</p>
                    <p className="flex items-center gap-2"><Ruler size={14} className="text-text-muted shrink-0" />{jedinica_mere}</p>
                    <p className="flex items-center gap-2"><Tag size={14} className="text-text-muted shrink-0" />{kategorija}</p>
                </div>
            </div>
        </Link>
    );
}

export default ProizvodCard