import { useState, useEffect } from "react";
import axios from 'axios'

interface Pozicija {
    id: number;
    naziv: string;
}

interface Zaposleni {
    id: number;
    ime: string;
    prezime: string;
    jmbg: string;
    broj_telefona: string;
    pozicija: Pozicija;
}

const View = () => {
    const [zaposleni, setZaposleni] = useState<Zaposleni[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/accounts/zaposleni/')
            .then((res) => {
                setZaposleni(res.data);
            })
    }, [])

    return(
        <div>
            {zaposleni.map((zaposlen) => (
                <p key={zaposlen.id}>{zaposlen.ime} - {zaposlen.prezime} - {zaposlen.jmbg} - {zaposlen.broj_telefona} - {zaposlen.pozicija.naziv}</p>
            ))}
        </div>
    );
}

export default View