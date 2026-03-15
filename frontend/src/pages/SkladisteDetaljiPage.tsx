import { useParams } from 'react-router-dom'
import Header from '@/components/Header'

const SkladisteDetaljiPage = () => {
    const { id } = useParams();

    return (
        <section className="pr-[5%] flex flex-col gap-10">
            <Header heading="Detalji skladišta" />

            
        </section>
    )
}

export default SkladisteDetaljiPage