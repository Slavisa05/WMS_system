import Header from "@/components/Header";
import SkladisteCard from "@/components/SkladisteCard";
import Button from "@/components/Button";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface Skladiste {
    id: number;
    naziv: string;
    adresa: string;
    tip: 'DIST' | 'VELE' | 'MALO' | 'TRAN';
}

const SkladistaPage = () => {
    const [skladista, setSkladista] = useState<Skladiste[]>([
        { id: 1, naziv: 'Veleprodajno skladište', adresa: 'Prvog Maja 61, Ub 14210', tip: 'VELE' },
        { id: 2, naziv: 'Maloprodajno skladište', adresa: 'Industrijska 5, Beograd 11000', tip: 'MALO' },
        { id: 3, naziv: 'Distributivni centar', adresa: 'Kralja Petra 12, Novi Sad 21000', tip: 'DIST' },
    ])
    const [search, setSearch] = useState('')

    const filteredSkladista = skladista.filter(s =>
        s.naziv.toLowerCase().includes(search.toLowerCase())
    )

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading='Skladista' />

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="Pretraži skladišta..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-border text-sm transition-all duration-150 hover:border-primary focus:outline-none focus:border-primary"
                    />
                </div>
                <Button icon={Plus} text="Dodaj novo skladište" />
            </div>

            <div className="flex flex-wrap w-full gap-3">
                {filteredSkladista.map(s => (
                    <SkladisteCard key={s.id} id={s.id} naziv={s.naziv} adresa={s.adresa} tip={s.tip} />
                ))}
            </div>
        </section>
    );
}

export default SkladistaPage