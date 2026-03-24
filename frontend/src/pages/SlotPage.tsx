import { Boxes, LayoutGrid, Warehouse, PackageCheck, PackageOpen } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import useSlot from "@/hooks/useSlot";

const SlotPage = () => {
    const { id } = useParams();
    const { slot, isLoading, error } = useSlot(Number(id));

    if (isLoading) return 'Loading...';
    if (error) return `Greska: ${error}`;

    const procenat = slot && slot.kapacitet > 0 ? Math.round((slot.zauzet_kapacitet / slot.kapacitet) * 100) : 0;

    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji slota" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Slot 1</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='izmeni' />
                        <Button text='obriši' variant='secondary' />
                    </div>
                </div>
                <p className="flex items-center gap-2"><LayoutGrid size={16} className="text-text-muted shrink-0" />Sektor: {slot?.sektor.naziv}</p>
                <p className="flex items-center gap-2"><Warehouse size={16} className="text-text-muted shrink-0" />Skladište: {slot?.sektor.skladiste.naziv}</p>
                <p className="flex items-center gap-2"><Boxes size={16} className="text-text-muted shrink-0" />Kapacitet: {slot?.kapacitet}</p>
                <p className="flex items-center gap-2"><PackageCheck size={16} className="text-text-muted shrink-0" />Zauzeto: {slot?.zauzet_kapacitet}</p>
                <p className="flex items-center gap-2"><PackageOpen size={16} className="text-text-muted shrink-0" />Slobodno: {slot?.slobodan_kapacitet}</p>

                <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm text-text-muted">
                        <span>Popunjenost</span>
                        <span>{procenat}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-background overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${procenat}%`,
                                backgroundColor: procenat >= 90 ? '#ef4444' : procenat >= 60 ? '#f97316' : '#22c55e'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SlotPage