"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [podaci, setPodaci] = useState({ klijent: '', kampanja: '', period: '', napomena: '', link: '' });
  
  // Nova, napredna struktura sajtova sa odvojenim Desktop i Mobile banerima
  const [sajtovi, setSajtovi] = useState([
    {
      ime: 'Blic.rs', utm: '', izabran: true,
      desktop: [
        { ime: 'Bilboard 970x250', izabran: false }, { ime: 'Premium 300x250', izabran: false },
        { ime: 'Premium 300x600', izabran: false }, { ime: 'Standard 300x250', izabran: false },
        { ime: 'Standard 300x600', izabran: false }, { ime: 'Brending 100% 400', izabran: false },
        { ime: 'Footer billboard', izabran: false }
      ],
      mobile: [
        { ime: 'Premium 320x50', izabran: false }, { ime: 'Premium 320x100', izabran: false },
        { ime: 'Premium 300x250', izabran: false }, { ime: 'Standard 320x50', izabran: false },
        { ime: 'Standard 320x100', izabran: false }, { ime: 'Standard 300x250', izabran: false },
        { ime: 'Sticky 320x100', izabran: false }
      ]
    },
    {
      ime: 'Ana.rs', utm: 'ana.rs', izabran: false,
      desktop: [
        { ime: 'Billboard 970x250', izabran: false }, { ime: 'Premium 300x600', izabran: false },
        { ime: 'Premium InFeed 580x280, 790x200', izabran: false }, { ime: 'Standard 300x600', izabran: false },
        { ime: 'Standard InFeed 580x280, 790x200', izabran: false }, { ime: 'Branding 470x1080', izabran: false },
        { ime: 'Footer Billboard 750x200', izabran: false }, { ime: 'Preroll video', izabran: false }
      ],
      mobile: [
        { ime: 'Billboard 320x100', izabran: false }, { ime: 'Premium 320x100', izabran: false },
        { ime: 'Premium 300x250', izabran: false }, { ime: 'Standard 320x100', izabran: false },
        { ime: 'Standard 300x250', izabran: false }, { ime: 'Sticky 320x100', izabran: false }
      ]
    },
    {
      ime: 'Žena.rs', utm: 'zena.rs', izabran: false,
      desktop: [
        { ime: 'Premium 970x250', izabran: false }, { ime: 'Standard 300x250', izabran: false },
        { ime: 'Standard 300x600', izabran: false }, { ime: 'Premium 300x250', izabran: false },
        { ime: 'Premium 300x600', izabran: false }
      ],
      mobile: [
        { ime: 'Premium 320x50', izabran: false }, { ime: 'Premium 320x100', izabran: false },
        { ime: 'Premium 300x250', izabran: false }, { ime: 'Standard 320x50', izabran: false },
        { ime: 'Standard 320x100', izabran: false }, { ime: 'P2 300x250', izabran: false },
        { ime: 'Sticky 320x100', izabran: false }
      ]
    },
    {
      ime: 'Pulsonline.rs', utm: 'pulsonline.rs', izabran: false,
      desktop: [
        { ime: 'Billboard 970x250', izabran: false }, { ime: 'P1 300x250/336x280', izabran: false },
        { ime: 'P2 300x250/336x280', izabran: false }, { ime: 'P3 300x250/336x280', izabran: false },
        { ime: 'Footer Billboard 750x200', izabran: false }
      ],
      mobile: [
        { ime: 'Billboard 320x100', izabran: false }, { ime: 'P1 300x250', izabran: false },
        { ime: 'P2 300x250', izabran: false }, { ime: 'P3 300x250', izabran: false },
        { ime: 'Sticky 320x100', izabran: false }
      ]
    },
    {
      ime: 'SuperRecepti', utm: 'superrecepti', izabran: false,
      desktop: [
        { ime: 'Premium 970x250', izabran: false }, { ime: 'Premium 300x250', izabran: false },
        { ime: 'Premium 300x600', izabran: false }, { ime: 'Standard 300x250', izabran: false },
        { ime: 'Standard 300x600', izabran: false }
      ],
      mobile: [
        { ime: 'Premium 320x100', izabran: false }, { ime: 'Standard 300x250', izabran: false },
        { ime: 'Premium 300x250', izabran: false }, { ime: 'Standard 320x100', izabran: false }
      ]
    },
    {
      ime: 'Nekretnine.rs', utm: 'nekretnine.rs', izabran: false,
      desktop: [{ ime: 'Premium 970x250', izabran: false }, { ime: 'Premium 300x250', izabran: false }, { ime: 'Standard 300x250', izabran: false }],
      mobile: [{ ime: 'Premium 320x100', izabran: false }, { ime: 'Standard 300x250', izabran: false }]
    },
    {
      ime: 'Mojauto', utm: 'mojauto', izabran: false,
      desktop: [{ ime: 'Premium 970x250', izabran: false }, { ime: 'Premium 300x250', izabran: false }, { ime: 'Standard 300x250', izabran: false }],
      mobile: [{ ime: 'Premium 320x100', izabran: false }, { ime: 'Standard 300x250', izabran: false }]
    }
  ]);

  const [gotovMejl, setGotovMejl] = useState('');
  const [slikaUrl, setSlikaUrl] = useState('');
  const [istorija, setIstorija] = useState<any[]>([]);

  useEffect(() => { ucitajIstoriju(); }, []);

  const ucitajIstoriju = async () => {
    const { data } = await supabase.from('kampanje').select('*').order('created_at', { ascending: false });
    if (data) setIstorija(data);
  };

  const handleChange = (e: any) => setPodaci({ ...podaci, [e.target.name]: e.target.value });

  const handleSajtToggle = (index: number) => {
    const novi = [...sajtovi];
    novi[index].izabran = !novi[index].izabran;
    setSajtovi(novi);
  };

  const handleBannerToggle = (sajtIndex: number, platforma: 'desktop' | 'mobile', bannerIndex: number) => {
    const novi = [...sajtovi];
    novi[sajtIndex][platforma][bannerIndex].izabran = !novi[sajtIndex][platforma][bannerIndex].izabran;
    setSajtovi(novi);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // NOVO: Čistimo ime fajla od razmaka i specijalnih karaktera da spriječimo grešku
    const cistoIme = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}-${cistoIme}`;
    
    const { data, error } = await supabase.storage.from('kreative').upload(fileName, file);
    
    if (error) {
      alert("Greška pri uploadu: " + error.message);
    } else {
      const publicUrl = supabase.storage.from('kreative').getPublicUrl(fileName).data.publicUrl;
      setSlikaUrl(publicUrl);
      alert("Vizual je uspješno sačuvan i spreman za link!");
    }
  };

  // Pametna logika za spajanje "Premium" i "Standard" banera
  function spojiBanere(baneri: any[]) {
    let premiums: string[] = [];
    let standards: string[] = [];
    let ostali: string[] = [];

    // Razdvajanje
    baneri.forEach(b => {
      let ime = b.ime.trim().replace(/px/g, ''); // cistimo px
      if (ime.startsWith('Premium ')) premiums.push(ime.replace('Premium ', ''));
      else if (ime.startsWith('Standard ')) standards.push(ime.replace('Standard ', ''));
      else ostali.push(ime);
    });

    let kombinovano: string[] = [];
    let preostaliPremiums: string[] = [];

    // Spajanje
    premiums.forEach(p => {
      if (standards.includes(p)) {
        kombinovano.push(`Premium + Standard ${p}`);
        standards = standards.filter(s => s !== p); // Brisanje iskoriscenog standarda
      } else {
        preostaliPremiums.push(`Premium ${p}`);
      }
    });

    let preostaliStandards = standards.map(s => `Standard ${s}`);

    return [...kombinovano, ...preostaliPremiums, ...preostaliStandards, ...ostali].join('\n');
  }

  const generisiISacuvaj = async () => {
    let osnovniLink = podaci.link.trim();
    if(osnovniLink.includes('?')) osnovniLink = osnovniLink.split('?')[0];

    let sajtoviText = '';

    sajtovi.filter(s => s.izabran).forEach(s => {
      let deskIzabrani = s.desktop.filter(b => b.izabran);
      let mobIzabrani = s.mobile.filter(b => b.izabran);

      if (deskIzabrani.length === 0 && mobIzabrani.length === 0) return; // Preskoci ako nema banera

      let finalLink = osnovniLink;
      if(s.utm !== "") finalLink = `${osnovniLink}?utm_source=${s.utm}&utm_medium=referral&utm_campaign=${podaci.kampanja}`;
      
      let sajtDeo = `\n${s.ime}:`;
      if (deskIzabrani.length > 0) sajtDeo += `\nDesktop:\n${spojiBanere(deskIzabrani)}`;
      if (mobIzabrani.length > 0) sajtDeo += `\nMobile:\n${spojiBanere(mobIzabrani)}`;
      sajtDeo += `\nLink: ${finalLink}\n`;

      sajtoviText += sajtDeo;
    });

    let mejl = `Drage kolege,\n\nInfo za postavku kampanje je ispod:\n\nKlijent: ${podaci.klijent}\nKampanja: ${podaci.kampanja}\nPeriod: ${podaci.period}\n\n${podaci.napomena}\n${sajtoviText}`;
    if (slikaUrl) mejl += `\nLink ka vizualu: ${slikaUrl}`;

    setGotovMejl(mejl);

    await supabase.from('kampanje').insert([
      { klijent: podaci.klijent, kampanja: podaci.kampanja, period: podaci.period, generisani_mejl: mejl }
    ]);

    ucitajIstoriju();

    const naslovMejla = encodeURIComponent(`Postavka kampanje: ${podaci.klijent} - ${podaci.kampanja}`);
    const tekstMejla = encodeURIComponent(mejl);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${naslovMejla}&body=${tekstMejla}`, '_blank');
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mb-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">🚀 Napredni Generator Kampanja</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="border p-2 rounded w-full" name="klijent" placeholder="Klijent" onChange={handleChange} />
          <input className="border p-2 rounded w-full" name="kampanja" placeholder="Kampanja" onChange={handleChange} />
          <input className="border p-2 rounded w-full" name="period" placeholder="Period" onChange={handleChange} />
          <input className="border p-2 rounded w-full" name="link" placeholder="Glavni Link (bez UTM)" onChange={handleChange} />
        </div>
        <input className="border p-2 rounded w-full mb-8" name="napomena" placeholder="Napomena (Frekvencija i intenzitet...)" onChange={handleChange} />

        <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">📍 Izbor Sajtova i Pozicija</h2>
        
        {/* Generisanje lista sajtova i banera */}
        <div className="space-y-4 mb-8">
          {sajtovi.map((sajt, sIndex) => (
            <div key={sIndex} className="border rounded-lg overflow-hidden">
              {/* Zaglavlje sajta (Check/Uncheck) */}
              <div className={`p-3 font-bold flex items-center space-x-3 cursor-pointer ${sajt.izabran ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => handleSajtToggle(sIndex)}>
                <input type="checkbox" checked={sajt.izabran} readOnly className="w-5 h-5 cursor-pointer" />
                <span>{sajt.ime}</span>
              </div>

              {/* Telo sa banerima (Prikazuje se samo ako je sajt štikliran) */}
              {sajt.izabran && (
                <div className="p-4 grid grid-cols-2 gap-6 bg-white">
                  {/* Desktop kolona */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 mb-2 uppercase tracking-wide border-b pb-1">🖥️ Desktop</h3>
                    <div className="space-y-2">
                      {sajt.desktop.map((baner, bIndex) => (
                        <label key={bIndex} className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input type="checkbox" checked={baner.izabran} onChange={() => handleBannerToggle(sIndex, 'desktop', bIndex)} className="rounded text-blue-600" />
                          <span>{baner.ime}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mobile kolona */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 mb-2 uppercase tracking-wide border-b pb-1">📱 Mobile</h3>
                    <div className="space-y-2">
                      {sajt.mobile.map((baner, bIndex) => (
                        <label key={bIndex} className="flex items-center space-x-2 cursor-pointer text-sm">
                          <input type="checkbox" checked={baner.izabran} onChange={() => handleBannerToggle(sIndex, 'mobile', bIndex)} className="rounded text-green-600" />
                          <span>{baner.ime}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mb-6 p-4 border border-dashed border-gray-400 rounded-lg bg-gray-50">
          <p className="font-bold mb-2">Dodaj Vizual (Banner):</p>
          <input type="file" onChange={handleUpload} className="w-full" />
        </div>

        <button onClick={generisiISacuvaj} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
          Generiši Mejl, Sačuvaj i Otvori u Gmail-u ✉️
        </button>

        {gotovMejl && (
          <div className="mt-8">
            <h2 className="font-bold mb-2">Pregled teksta kampanje:</h2>
            <textarea readOnly className="w-full h-96 p-4 border rounded bg-gray-100 text-sm font-mono" value={gotovMejl} />
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-700">🕒 Istorija Prethodnih Kampanja</h2>
        <div className="space-y-4">
          {istorija.map((k, i) => (
            <div key={i} className="border-b pb-4 flex justify-between items-center bg-gray-50 p-3 rounded">
              <div>
                <p className="font-bold text-blue-600">{k.klijent} - {k.kampanja}</p>
                <p className="text-xs text-gray-500">Period: {k.period} | Kreirano: {new Date(k.created_at).toLocaleDateString('sr-RS')}</p>
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(k.generisani_mejl); alert("Kopirano!"); }}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300 transition"
              >
                📋 Kopiraj
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}