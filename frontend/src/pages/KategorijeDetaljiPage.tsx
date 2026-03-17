import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";

interface KategorijeDetaljiPageProps {
    id: number;
    naziv: string;
    brojProizvoda: number;
}

const KategorijeDetaljiPage = () => {
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Kategorija stranica" />

            <div className="flex flex-wrap pl-4 gap-8 justify-between items-center w-full bg-sidebar text-sidebar-text rounded-xl">
                <h2>Sokovi</h2>
                <div className="flex items-center gap-2 py-4 px-8 rounded-xl">
                    <Button text='izmeni' />
                    <Button text='obriši' variant='secondary' />
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-8 px-4 py-2 items-center justify-between w-full bg-sidebar text-sidebar-text rounded-xl">
                    <h2>Proizvodi</h2> 
                    <div className="flex items-center gap-2 px-8 py-4 rounded-xl bg-sidebar">
                        <Button icon={Plus} text='dodaj proizvod' />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <ProizvodCard id={1} naziv="koka kola" barkod="12345678" sifra='KK-001' jedinica_mere='ml' kategorija='sokovi' />
                    <ProizvodCard id={2} naziv="fanta" barkod="1234abcd" sifra='FA-001' jedinica_mere='ml' kategorija='sokovi' />
                    <ProizvodCard id={3} naziv="sprite" barkod="1e3q5h7j" sifra='SP-001' jedinica_mere='l' kategorija='sokovi' />
                    <ProizvodCard id={4} naziv="mirinda" barkod="564asdad" sifra='Mi-001' jedinica_mere='ml' kategorija='sokovi' />
                </div>
            </div>
        </section>
    );
}

export default KategorijeDetaljiPage