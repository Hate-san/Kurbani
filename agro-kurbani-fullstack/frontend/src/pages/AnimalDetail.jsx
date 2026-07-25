import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import ShareStub from '../components/ShareStub';
import { fmt, EMOJI } from '../components/AnimalCard';
import { useCart } from '../context/CartContext';

const DARK_BG = { Cow: '#25402b', Goat: '#2c4a33', Sheep: '#31513a', Camel: '#3a5a3f' };

export default function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [animal, setAnimal] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    client.get(`/animals/${id}`).then((res) => {
      setAnimal(res.data.animal);
      setQty(1);
    });
  }, [id]);

  if (!animal) return <div className="text-center py-16 text-ink/40">Loading…</div>;

  const soldOut = animal.available_shares <= 0;
  const isShareSale = animal.total_shares > 1;
  const taken = animal.total_shares - animal.available_shares;
  const clampedQty = Math.min(qty, animal.available_shares || 1);
  const subtotal = animal.price_per_share * clampedQty;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function handleAddToCart() {
    addItem(animal, isShareSale ? clampedQty : 1);
    showToast('Added to cart');
  }

  function handleBuyNow() {
    addItem(animal, isShareSale ? clampedQty : 1);
    navigate('/checkout');
  }

  return (
    <div>
      <div className="text-sm text-ink/50 mb-5">
        <Link to="/animals" className="text-forest font-semibold">Browse Animals</Link> / {animal.title}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
        <div>
          <div className="h-72 rounded-2xl flex items-center justify-center text-8xl text-paper" style={{ background: DARK_BG[animal.category] || '#25402b' }}>
            {EMOJI[animal.category]}
          </div>
          <div className="mt-5">
            <h3 className="text-xs uppercase tracking-wide text-ink/50 mb-2">Description</h3>
            <p className="text-ink/80 leading-relaxed text-sm">{animal.description}</p>
          </div>
          <div className="mt-5">
            <h3 className="text-xs uppercase tracking-wide text-ink/50 mb-2">Share tickets</h3>
            <p className="text-ink/50 text-sm mb-3">
              {isShareSale ? 'Click a stub to select how many shares to reserve.' : 'This animal is sold whole — one ticket, one buyer.'}
            </p>
            <ShareStub
              total={animal.total_shares}
              taken={taken}
              selected={soldOut ? 0 : clampedQty}
              size="lg"
              interactive={isShareSale && !soldOut}
              onPick={(n) => setQty(n)}
            />
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-xl p-6">
          <span className="font-mono text-xs uppercase tracking-widest text-rust">{animal.category}</span>
          <h2 className="font-display text-2xl mt-1">{animal.title}</h2>
          <div className="text-ink/50 mb-4">{animal.breed}</div>

          {[
            ['Farmer', animal.farmer?.name || '—'],
            ['Location', animal.farm_location],
            ['Age', animal.age],
            ['Weight', `${animal.weight} kg`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-dashed border-ink/10 text-sm">
              <span className="text-ink/50">{k}</span><span className="font-semibold">{v}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 text-sm">
            <span className="text-ink/50">Status</span>
            <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${soldOut ? 'bg-rust/15 text-rust' : 'bg-green-700/10 text-green-800'}`}>
              {soldOut ? 'Sold out' : 'Available'}
            </span>
          </div>

          <div className="border-t border-ink/10 mt-3 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Price {isShareSale ? 'per share' : '(whole)'}</span>
              <span className="font-mono font-semibold">{fmt(animal.price_per_share)}</span>
            </div>

            {isShareSale && (
              <div className="flex items-center gap-3 my-4">
                <button
                  className="w-8 h-8 border border-forest rounded-md font-bold disabled:opacity-30"
                  disabled={clampedQty <= 1 || soldOut}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >−</button>
                <span className="font-mono text-lg w-6 text-center">{clampedQty}</span>
                <button
                  className="w-8 h-8 border border-forest rounded-md font-bold disabled:opacity-30"
                  disabled={clampedQty >= animal.available_shares || soldOut}
                  onClick={() => setQty((q) => q + 1)}
                >+</button>
                <span className="text-xs text-ink/50">of {animal.available_shares} shares left</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">Subtotal</span>
              <span className="font-mono text-lg">{fmt(subtotal)}</span>
            </div>

            <button onClick={handleAddToCart} disabled={soldOut} className="w-full bg-gold text-forestDark font-semibold py-2.5 rounded-md mt-4 disabled:opacity-40">
              {soldOut ? 'Sold out' : 'Add to cart'}
            </button>
            <button onClick={handleBuyNow} disabled={soldOut} className="w-full border border-forest text-forest font-semibold py-2.5 rounded-md mt-2.5 disabled:opacity-40">
              Buy now
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest text-paper px-5 py-3 rounded-lg shadow-lg border border-gold text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
