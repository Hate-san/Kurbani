import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import AnimalCard from '../components/AnimalCard';

const CATS = ['All', 'Cow', 'Goat', 'Sheep', 'Camel'];

export default function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    const query = activeCat !== 'All' ? `?category=${activeCat}` : '';
    client.get(`/animals${query}`)
      .then((res) => setAnimals(res.data.animals))
      .finally(() => setLoading(false));
  }, [activeCat]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-ink/50 block mb-1">{animals.length} listings</span>
          <h2 className="font-display text-2xl">Browse animals</h2>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setParams(c === 'All' ? {} : { category: c })}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${activeCat === c ? 'bg-forest border-forest text-paper' : 'bg-white border-ink/20'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink/40">Loading animals…</div>
      ) : animals.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {animals.map((a) => <AnimalCard key={a.id} animal={a} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-ink/40">
          <div className="text-4xl mb-3">🔍</div>
          No animals in this category right now.
        </div>
      )}
    </div>
  );
}
