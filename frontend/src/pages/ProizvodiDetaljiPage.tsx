import { Barcode, Hash, Ruler, Tag, Package, Lock, PackageOpen } from "lucide-react"
import { useParams } from "react-router-dom"
import Header from "@/components/Header"
import Button from "@/components/Button"
import ZalihePoSlotovima from "@/components/ZalihePoSlotovima"
import useProizvod from "@/hooks/useProizvod"
import useZalihe from "@/hooks/useZalihe"

const ProizvodiDetaljiPage = () => {
    const { id } = useParams();
    const { proizvod, isLoading, error } = useProizvod(Number(id));
    const { zalihe } = useZalihe();
    
    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;
    
    const zaliheProizvoda = zalihe.filter(z => z.proizvod.id === proizvod?.id);

    const ukupno = zaliheProizvoda.reduce((sum, z) => sum + Number(z.kolicina), 0);
    const rezervisano = zaliheProizvoda.reduce((sum, z) => sum + Number(z.rezervisana_kolicina), 0);
    const dostupno = zaliheProizvoda.reduce((sum, z) => sum + Number(z.dostupna_kolicina), 0);

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji proizvoda" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>{proizvod?.naziv}</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Barcode size={16} className="text-text-muted shrink-0" />Barkod: {proizvod?.barkod}</p>
                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />Šifra: {proizvod?.sifra}</p>
                <p className="flex items-center gap-2"><Ruler size={16} className="text-text-muted shrink-0" />Jedinica mere: {proizvod?.jedinica_mere}</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted shrink-0" />Kategorija: {proizvod?.kategorija.naziv}</p>
            </div>

            <div className="flex flex-col gap-6">
                <h2>Zalihe po slotovima:</h2>
                <div className="flex flex-wrap gap-4">
                    {zaliheProizvoda.map(z => (
                        <ZalihePoSlotovima key={1} {...z} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <h2>Ukupne zalihe</h2>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <p className="flex items-center gap-2"><Package size={14} className="text-text-muted shrink-0" />Ukupno: {ukupno}</p>
                    <p className="flex items-center gap-2"><Lock size={14} className="text-text-muted shrink-0" />Rezervisano: {rezervisano}</p>
                    <p className="flex items-center gap-2"><PackageOpen size={14} className="text-text-muted shrink-0" />Dostupno: {dostupno}</p>
                </div>
            </div>
        </section>
    );
}

export default ProizvodiDetaljiPage