import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import SkladisteCard from "@/components/SkladisteCard";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";

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

            <SearchBar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Pretraži skladišta..."
                action={<Button icon={Plus} text="Dodaj novo skladište" />}
            />

            <div className="flex flex-wrap w-full gap-3">
                {filteredSkladista.map(s => (
                    <SkladisteCard key={s.id} id={s.id} naziv={s.naziv} adresa={s.adresa} tip={s.tip} />
                ))}
            </div>
        </section>
    );
}

export default SkladistaPage