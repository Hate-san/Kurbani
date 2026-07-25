import { Link } from 'react-router-dom';
import ShareStub from './ShareStub';

const EMOJI = { Cow: '🐄', Goat: '🐐', Sheep: '🐑', Camel: '🐫' };
const BG = { Cow: '#e7dfc4', Goat: '#e2ded0', Sheep: '#e9e6d8', Camel: '#e4d9bd' };

function fmt(n) {
  return '৳' + Number(n).toLocaleString('en-US');
}

export default function AnimalCard({ animal }) {
  const soldOut = animal.available_shares <= 0;
  const taken = animal.total_shares - animal.available_shares;

  return (
    <Link
      to={`/animals/${animal.id}`}
      className="bg-white border border-ink/10 rounded-xl overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(24,42,28,0.15)]"
    >
      <div className="h-32 flex items-center justify-center text-5xl relative border-b border-ink/10" style={{ background: BG[animal.category] || '#e7dfc4' }}>
        <span className={`absolute top-2 left-2 text-[10px] uppercase tracking-wide px-2 py-1 rounded ${soldOut ? 'bg-rust text-white' : 'bg-forest text-paper'}`}>
          {soldOut ? 'Sold out' : animal.category}
        </span>
        {EMOJI[animal.category] || '🐾'}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg font-semibold">{animal.title}</h3>
        <div className="text-sm text-ink/60">{animal.breed} · {animal.farm_location}</div>
        <ShareStub total={animal.total_shares} taken={taken} />
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="font-mono font-semibold text-forest">{fmt(animal.price_per_share)}</div>
            <div className="text-[11px] text-ink/50">{animal.total_shares > 1 ? 'per share' : 'whole animal'}</div>
          </div>
          <div className="font-mono text-xs text-ink/50">{animal.available_shares}/{animal.total_shares} left</div>
        </div>
      </div>
    </Link>
  );
}

export { fmt, EMOJI, BG };
