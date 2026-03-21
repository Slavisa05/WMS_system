import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProizvodCard from "@/components/ProizvodCard";
import useKategorija from "@/hooks/useKategorija";
import useProizvode from "@/hooks/useProizvode";

const KategorijeDetaljiPage = () => {
    const { id } = useParams()
    const { kategorija, isLoading, error } = useKategorija(Number(id))
    const { proizvodi } = useProizvode()

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const proizvodiKategorije = proizvodi.filter(p => p.kategorija.id === Number(id))

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Kategorija stranica" />

            <div className="flex flex-wrap pl-4 gap-8 justify-between items-center w-full bg-sidebar text-sidebar-text rounded-xl">
                <h2>{kategorija?.naziv}</h2>
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
                    {proizvodiKategorije.map(p => (
                        <ProizvodCard key={p.id} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default KategorijeDetaljiPage