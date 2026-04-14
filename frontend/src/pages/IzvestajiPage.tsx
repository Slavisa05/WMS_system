import { useState, useEffect, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Legend, ResponsiveContainer } from 'recharts'
import ExcelJS from "exceljs" 
import api from "@/api/axios"
import Header from "@/components/Header"
import Button from "@/components/Button"

const COLORS = ['#FFC107', '#2196F3', '#4CAF50', '#F44336']

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{description}</p>
            </div>
            {children}
        </div>
    )
}

export default function IzvestajiPage() {
    // PDF
    const reportRef = useRef<HTMLDivElement>(null)

    // EXCEL
    const exportExcel = async () => {
        try {
            const wb = new ExcelJS.Workbook()

            // Sheet 1 — Promet robe
            const ws1 = wb.addWorksheet('Promet robe')
            ws1.columns = [
                { header: 'Period', key: 'period', width: 20 },
                { header: 'Ulaz', key: 'ulaz', width: 15 },
                { header: 'Izlaz', key: 'izlaz', width: 15 },
            ]
            ws1.addRows(prometRobe)

            // Sheet 2 — Popunjenost skladišta
            const ws2 = wb.addWorksheet('Popunjenost skladista')
            ws2.columns = [
                { header: 'Skladište', key: 'naziv', width: 25 },
                { header: 'Kapacitet', key: 'ukupni_kapacitet', width: 15 },
                { header: 'Trenutna količina', key: 'trenutna_kolicina', width: 20 },
                { header: 'Popunjenost (%)', key: 'popunjenost_procenat', width: 20 },
            ]
            ws2.addRows(popunjenost)

            // Sheet 3 — Top proizvodi
            const ws3 = wb.addWorksheet('Top proizvodi')
            ws3.columns = [
                { header: 'Proizvod', key: 'proizvod__naziv', width: 30 },
                { header: 'Količina', key: 'ukupno', width: 15 },
            ]
            ws3.addRows(topProizvodi)

            // Sheet 4 — Dokumenta po statusu
            const ws4 = wb.addWorksheet('Dokumenta status')
            ws4.columns = [
                { header: 'Status', key: 'status', width: 20 },
                { header: 'Broj', key: 'ukupno', width: 15 },
            ]
            ws4.addRows(dokumentaStatus)

            // Sheet 5 — Dokumenta po tipu
            const ws5 = wb.addWorksheet('Dokumenta tip')
            ws5.columns = [
                { header: 'Tip', key: 'tip', width: 20 },
                { header: 'Broj', key: 'ukupno', width: 15 },
            ]
            ws5.addRows(dokumentaTip)

            // Sheet 6 — Vrednost zaliha
            const ws6 = wb.addWorksheet('Vrednost zaliha')
            ws6.columns = [
                { header: 'Kategorija', key: 'proizvod__kategorija__naziv', width: 30 },
                { header: 'Ukupna vrednost (RSD)', key: 'ukupna_vrednost', width: 25 },
            ]
            ws6.addRows(vrednostZaliha)

            // Download
            const buffer = await wb.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'izvjestaj.xlsx'
            a.click()
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Error exporting Excel:', err)
            alert('Greška pri eksportu u Excel: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    const [prometRobe, setPrometRobe] = useState([])
    const [period, setPeriod] = useState('dnevno')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setError(null)
        api.get(`/reports/promet_robe/?period=${period}`)
            .then(res => setPrometRobe(Array.isArray(res.data) ? res.data : res.data.results ?? []))
            .catch(err => {
                console.error('Error fetching data:', err)
                setError(err.response?.data?.detail || err.message || 'Greška pri učitavanju podataka')
            })
    }, [period])

    const [popunjenost, setPopunjenost] = useState([])
    const [topProizvodi, setTopProizvodi] = useState([])
    const [dokumentaStatus, setDokumentaStatus] = useState<{ status: string; ukupno: number; fill: string }[]>([])
    const [dokumentaTip, setDokumentaTip] = useState([])
    const [vrednostZaliha, setVrednostZaliha] = useState([])

    useEffect(() => {
        api.get('/reports/popunjenost_skladista/').then(res => setPopunjenost(Array.isArray(res.data) ? res.data : res.data.results ?? []))
            .catch(err => console.error('Error fetching popunjenost:', err))
        api.get('/reports/top_proizvodi/').then(res => setTopProizvodi(Array.isArray(res.data) ? res.data : res.data.results ?? []))
            .catch(err => console.error('Error fetching top proizvodi:', err))
        api.get('/reports/dokument_status/').then(res => { const arr = Array.isArray(res.data) ? res.data : res.data.results ?? []; setDokumentaStatus(arr.map((item: { status: string; ukupno: number }, index: number) => ({ ...item, fill: COLORS[index % COLORS.length] }))) })
            .catch(err => console.error('Error fetching dokument status:', err))
        api.get('/reports/dokument_tip/').then(res => setDokumentaTip(Array.isArray(res.data) ? res.data : res.data.results ?? []))
            .catch(err => console.error('Error fetching dokument tip:', err))
        api.get('/reports/vrednost_zalihe/').then(res => setVrednostZaliha(Array.isArray(res.data) ? res.data : res.data.results ?? []))
            .catch(err => console.error('Error fetching vrednost zalihe:', err))
    }, [])

    return (
        <section className="pr-[5%] flex flex-col gap-6">
            <Header heading='Izvještaji' />

            <div className="flex gap-4">
                <Button text="Eksportuj u Excel" onClick={() => exportExcel()} />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <strong>Greška:</strong> {error}
                </div>
            )}

            <div ref={reportRef}>
                {/* CHART 1 — Promet robe */}
                <ChartCard
                title="Promet robe po periodu"
                description="Ulaz vs. izlaz robe po danu, sedmici ili mesecu"
            >
                <div className="flex gap-2">
                    {(['dnevno', 'nedeljno', 'mesecno'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                period === p
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {p === 'dnevno' ? 'Dnevno' : p === 'nedeljno' ? 'Nedeljno' : 'Mesečno'}
                        </button>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prometRobe}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ulaz" fill="#4CAF50" name="Ulaz" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="izlaz" fill="#F44336" name="Izlaz" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* CHART 2 — Popunjenost skladišta */}
            <ChartCard
                title="Popunjenost skladišta"
                description="Procenat popunjenosti kapaciteta po skladištu"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={popunjenost}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="naziv" tick={{ fontSize: 12 }} />
                        <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="popunjenost_procenat" fill="#2196F3" name="Popunjenost" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* CHART 3 — Top 10 proizvoda */}
            <ChartCard
                title="Top 10 proizvoda po prometu"
                description="Proizvodi koji se najviše kreću kroz skladište"
            >
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={topProizvodi} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="proizvod__naziv" type="category" width={160} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="ukupno" fill="#9C27B0" name="Količina" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* CHARTS 4 & 5 — side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard
                    title="Dokumenta po statusu"
                    description="Raspodela dokumenata: nacrt, na čekanju, odobreno, odbijeno"
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={dokumentaStatus}
                                dataKey="ukupno"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={95}
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                labelLine={false}
                            />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Dokumenta po tipu"
                    description="Broj otpremnica, prijemnica, otpisa i ostalih tipova"
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={dokumentaTip}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="tip" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="ukupno" fill="#FF9800" name="Broj dokumenata" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* CHART 6 — Vrednost zaliha */}
            <ChartCard
                title="Vrednost zaliha po kategoriji"
                description="Ukupna vrednost zaliha (količina × cena) grupisana po kategoriji"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vrednostZaliha}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="proizvod__kategorija__naziv" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => `${value} RSD`} />
                        <Bar dataKey="ukupna_vrednost" fill="#00BCD4" name="Vrednost (RSD)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
            </div>
        </section>
    )
}