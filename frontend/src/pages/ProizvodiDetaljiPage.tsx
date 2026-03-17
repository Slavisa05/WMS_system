import { Barcode, Hash, Ruler, Tag, Package, Lock, PackageOpen } from "lucide-react"
import Header from "@/components/Header"
import Button from "@/components/Button"
import ZalihePoSlotovima from "@/components/ZalihePoSlotovima"

const ProizvodiDetaljiPage = () => {
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Proizvod page" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Koka Kola</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Barcode size={16} className="text-text-muted shrink-0" />Barkod: 12345678</p>
                <p className="flex items-center gap-2"><Hash size={16} className="text-text-muted shrink-0" />Šifra: KK-001</p>
                <p className="flex items-center gap-2"><Ruler size={16} className="text-text-muted shrink-0" />Jedinica mere: ml</p>
                <p className="flex items-center gap-2"><Tag size={16} className="text-text-muted shrink-0" />Kategorija: sokovi</p>
            </div>

            <div className="flex flex-col gap-6">
                <h2>Zalihe po slotovima:</h2>
                <div className="flex flex-wrap gap-4">
                    <ZalihePoSlotovima slotId={1} slotNaziv="Slot 1" sektorId={5} sektorNaziv="Hladnjaca" skladisteId={2} skladisteNaziv="Veleprodaja" kolicina={100} rezervisanaKolicina={40} />
                    <ZalihePoSlotovima slotId={1} slotNaziv="Slot 2" sektorId={5} sektorNaziv="Komora" skladisteId={2} skladisteNaziv="Maloprodaja" kolicina={100} rezervisanaKolicina={40} />
                    <ZalihePoSlotovima slotId={1} slotNaziv="Slot 3" sektorId={5} sektorNaziv="Police" skladisteId={2} skladisteNaziv="Distruibutivni centar" kolicina={100} rezervisanaKolicina={40} />
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <h2>Ukupne zalihe</h2>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <p className="flex items-center gap-2"><Package size={14} className="text-text-muted shrink-0" />Ukupno: 300</p>
                    <p className="flex items-center gap-2"><Lock size={14} className="text-text-muted shrink-0" />Rezervisano: 120</p>
                    <p className="flex items-center gap-2"><PackageOpen size={14} className="text-text-muted shrink-0" />Dostupno: 180</p>
                </div>
            </div>
        </section>
    );
}

export default ProizvodiDetaljiPage