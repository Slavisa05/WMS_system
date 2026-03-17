import { Clock, Calendar, User, Building2, LogIn, LogOut, Truck } from "lucide-react"
import Header from "@/components/Header";
import Button from "@/components/Button";

interface StavkaDokumenta {
    id: number;
    proizvod: string;
    slotUlaza: string;
    slotIzlaza: string;
    kolicina: number;
    jedinicaMere: string;
    cena: number;
}

const DokumentaDetaljiPage = () => {
    const stavke: StavkaDokumenta[] = [
        { id: 1, proizvod: 'Coca Cola 330ml', slotUlaza: 'Slot A1', slotIzlaza: '—', kolicina: 150, jedinicaMere: 'kom', cena: 50 },
        { id: 2, proizvod: 'Pepsi 500ml', slotUlaza: 'Slot A2', slotIzlaza: '—', kolicina: 200, jedinicaMere: 'kom', cena: 45 },
        { id: 3, proizvod: 'Pepsi 500ml', slotUlaza: 'Slot A2', slotIzlaza: '—', kolicina: 200, jedinicaMere: 'kom', cena: 45 },
    ];
    const ukupno = stavke.reduce((sum, s) => sum + s.kolicina * s.cena, 0);
    return(
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Dokument" />

            <div className="flex flex-col gap-2 p-4 bg-sidebar text-sidebar-text rounded-xl">
                <div className="flex flex-wrap gap-8 justify-between items-center w-full">
                    <h2>Prijemnica #1452</h2>
                    <div className="flex items-center gap-2 py-4 px-8 rounded-xl bg-sidebar">
                        <Button text='prihvati' />
                        <Button text='odbij' variant='secondary' />
                    </div>
                </div>

                <p className="flex items-center gap-2"><Clock size={16} className="text-text-muted shrink-0" />Status: NA CEKANJU</p>
                <p className="flex items-center gap-2"><Calendar size={16} className="text-text-muted shrink-0" />Datum i Vreme: 17/03/2026 14:30h</p>
                <p className="flex items-center gap-2"><User size={16} className="text-text-muted shrink-0" />Zaposleni: Marko Markovic</p>
                <p className="flex items-center gap-2"><Building2 size={16} className="text-text-muted shrink-0" />Poslovni partner: IDEA</p>
                <p className="flex items-center gap-2"><LogIn size={16} className="text-text-muted shrink-0" />Skladiste ulaza: Veleprodajno skladiste</p>
                <p className="flex items-center gap-2"><LogOut size={16} className="text-text-muted shrink-0" />Skladiste izlaza: /</p>
                <p className="flex items-center gap-2"><Truck size={16} className="text-text-muted shrink-0" />Transport: /</p>
            </div>

            <div className="flex flex-col rounded-xl overflow-hidden border border-border">
                <div className="px-5 py-3 bg-sidebar">
                    <strong className="text-sidebar-text">Stavke dokumenta</strong>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-sidebar text-sidebar-text border-t border-border">
                            <th className="text-left px-5 py-2.5 font-medium">Proizvod</th>
                            <th className="text-left px-5 py-2.5 font-medium">Slot ulaza</th>
                            <th className="text-left px-5 py-2.5 font-medium">Slot izlaza</th>
                            <th className="text-right px-5 py-2.5 font-medium">Količina</th>
                            <th className="text-right px-5 py-2.5 font-medium">Cena</th>
                            <th className="text-right px-5 py-2.5 font-medium">Ukupno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stavke.map((s, i) => (
                            <tr key={s.id} className={i % 2 === 0 ? 'bg-background' : 'bg-sidebar/40'}>
                                <td className="px-5 py-2.5">{s.proizvod}</td>
                                <td className="px-5 py-2.5 text-text-muted">{s.slotUlaza}</td>
                                <td className="px-5 py-2.5 text-text-muted">{s.slotIzlaza}</td>
                                <td className="px-5 py-2.5 text-right">{s.kolicina} {s.jedinicaMere}</td>
                                <td className="px-5 py-2.5 text-right">{s.cena} rsd</td>
                                <td className="px-5 py-2.5 text-right font-medium">{(s.kolicina * s.cena).toLocaleString('sr-RS')} rsd</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-border bg-sidebar">
                            <td colSpan={5} className="px-5 py-3 text-right text-sidebar-text font-medium">Ukupno:</td>
                            <td className="px-5 py-3 text-right text-sidebar-text font-bold">{ukupno.toLocaleString('sr-RS')} rsd</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
}

export default DokumentaDetaljiPage