import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import AnimalCard from '../components/AnimalCard';

export default function Home() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    client.get('/animals?status=available').then((res) => setAnimals(res.data.animals.slice(0, 4)));
  }, []);

  return (
    <div>
      <section className="bg-forest text-paper rounded-2xl p-10 md:p-14 mb-11 relative overflow-hidden">
        <span className="font-mono text-xs uppercase tracking-widest text-goldLight block mb-3">Eid-ul-Adha 2026 · Now Booking</span>
        <h1 className="font-display text-3xl md:text-5xl leading-tight max-w-xl text-[#fdf9ee]">
          Buy a whole animal, or just your share of one.
        </h1>
        <p className="max-w-lg mt-4 text-paper/80 leading-relaxed">
          Agro Kurbani connects verified farmers directly with families performing Kurbani. Reserve a share
          ticket for a cow or camel, or take a whole goat or sheep — tracked from the farm to your Qurbani.
        </p>
        <div className="mt-7 flex gap-3 flex-wrap">
          <Link to="/animals" className="bg-gold text-forestDark font-semibold px-5 py-2.5 rounded-md hover:-translate-y-0.5 transition inline-block">Browse animals</Link>
          <Link to="/register" className="border border-paper/50 text-paper px-5 py-2.5 rounded-md hover:bg-white/10 inline-block">Create an account</Link>
        </div>
      </section>

      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-rust block mb-1">Filling fast</span>
          <h2 className="font-display text-2xl">Featured animals</h2>
        </div>
        <Link to="/animals" className="text-forest font-semibold underline text-sm">View all →</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {animals.map((a) => <AnimalCard key={a.id} animal={a} />)}
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-7">
        <h2 className="font-display text-xl mb-5">How a share ticket works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['1', 'List', 'Farmers list an animal with total shares — 7 for a cow or camel, 1 for a goat or sheep sold whole.'],
            ['2', 'Reserve', 'Each buyer claims one or more numbered stubs. A cow can be split across up to 7 households.'],
            ['3', 'Track', 'The stub row fills in as shares sell. When every stub is claimed, the animal is marked sold.'],
            ['4', 'Deliver', 'On Kurbani day, meat is portioned per share and delivery status is tracked to each buyer.'],
          ].map(([n, title, body]) => (
            <div key={n}>
              <div className="font-mono text-rust font-bold text-xs">STEP {n}</div>
              <h3 className="font-semibold mt-1 mb-1">{title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
