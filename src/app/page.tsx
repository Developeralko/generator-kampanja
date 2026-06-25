"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [podaci, setPodaci] = useState({ klijent: '', kampanja: '', period: '', napomena: '', link: '' });
  const [formati, setFormati] = useState(['Premium 970x250px', 'Premium+Standard 300x250px', 'Premium+Standard 300x600px', 'Premium+Standard 320x100px']);
  const [sajtovi, setSajtovi] = useState([
    { ime: 'Blic.rs', utm: '', izabran: true },
    { ime: 'Žena.rs', utm: 'zena.rs', izabran: true },
    { ime: 'Pulsonline.rs', utm: 'pulsonline.rs', izabran: true },
    { ime: 'SuperRecepti', utm: 'superrecepti', izabran: true },
    { ime: 'Ana.rs', utm: 'ana.rs', izabran: true },
    { ime: 'Nekretnine.rs', utm: 'nekretnine.rs', izabran: true },
    { ime: 'Mojauto', utm: 'mojauto', izabran: true }
  ]);
  const [gotovMejl, setGotovMejl] = useState('');
  const [slikaUrl, setSlikaUrl] = useState('');

  const handleChange = (e: any) => setPodaci({ ...podaci, [e.target.name]: e.target.value });

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('kreative').upload(fileName, file);
    
    if (error) {
      alert("Greška pri uploadu: " + error.message);
    } else {
      const publicUrl = supabase.storage.from('kreative').getPublicUrl(fileName).data.publicUrl;
      setSlikaUrl(publicUrl);
      alert("Vizual je uspešno sačuvan!");
    }
  };

  const generisiISacuvaj = async () => {
    let osnovniLink = podaci.link.trim();
    if(osnovniLink.includes('?')) osnovniLink = osnovniLink.split('?')[0];

    let formatiText = formati.join('\n');
    let sajtoviText = '';

    sajtovi.filter(s => s.izabran).forEach(s => {
      let finalLink = osnovniLink;
      if(s.utm !== "") finalLink = `${osnovniLink}?utm_source=${s.utm}&utm_medium=referral&utm_campaign=${podaci.kampanja}`;
      sajtoviText += `\n${s.ime}:\ndesktop+mobile plus app - ROS\n${formatiText}\nLink: ${finalLink}\n`;
    });

    let mejl = `Drage kolege,\n\nInfo za postavku kampanje je ispod:\n\nKlijent: ${podaci.klijent}\nKampanja: ${podaci.kampanja}\nPeriod: ${podaci.period}\n\n${podaci.napomena}\n${sajtoviText}`;
    
    if (slikaUrl) mejl += `\nLink ka vizualu: ${slikaUrl}`;

    setGotovMejl(mejl);

    const { error } = await supabase.from('kampanje').insert([
      { klijent: podaci.klijent, kampanja: podaci.kampanja, period: podaci.period, generisani_mejl: mejl }
    ]);

    if(error) console.error("Greška pri upisu u bazu:", error);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">🚀 Generator Kampanja</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="border p-2 rounded w-full" name="klijent" placeholder="Klijent (npr. Ringier)" onChange={handleChange} />
          <input className="border p-2 rounded w-full" name="kampanja" placeholder="Kampanja (npr. Vlado)" onChange={handleChange} />
          <input className="border p-2 rounded w-full" name="period" placeholder="Period" onChange={handleChange} />
          <input className="border p-2 rounded w-full" name="link" placeholder="Glavni Link (bez UTM)" onChange={handleChange} />
        </div>
        <input className="border p-2 rounded w-full mb-6" name="napomena" placeholder="Napomena (Frekvencija...)" onChange={handleChange} />

        <div className="mb-6 p-4 border border-dashed border-gray-400 rounded-lg bg-gray-50">
          <p className="font-bold mb-2">Dodaj Vizual (Banner):</p>
          <input type="file" onChange={handleUpload} className="w-full" />
        </div>

        <button onClick={generisiISacuvaj} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
          Generiši Mejl i Sačuvaj Kampanju
        </button>

        {gotovMejl && (
          <div className="mt-8">
            <h2 className="font-bold mb-2">Gotov tekst za mejl:</h2>
            <textarea readOnly className="w-full h-96 p-4 border rounded bg-gray-100" value={gotovMejl} />
          </div>
        )}
      </div>
    </main>
  );
}