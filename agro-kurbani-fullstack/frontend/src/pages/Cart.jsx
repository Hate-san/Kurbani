import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fmt, EMOJI, BG } from '../components/AnimalCard';

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div>
        <h2 className="font-display text-2xl mb-6">Your cart</h2>
        <div className="text-center py-16 text-ink/40">
          <div className="text-4xl mb-3">🧺</div>
          Your cart is empty.
          <div className="mt-5"><Link to="/animals" className="bg-gold text-forestDark font-semibold px-5 py-2.5 rounded-md">Browse animals</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Your cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
        <div className="bg-white border border-ink/10 rounded-xl p-5">
          {items.map((i) => (
            <div key={i.animalId} className="flex items-center gap-4 py-4 border-b border-ink/10 last:border-0">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl" style={{ background: BG[i.category] }}>{EMOJI[i.category]}</div>
              <div className="flex-1">
                <div className="font-semibold">{i.title}</div>
                <div className="text-sm text-ink/50">{i.shares} share{i.shares > 1 ? 's' : ''} × {fmt(i.pricePerShare)}</div>
              </div>
              <div className="font-mono font-semibold">{fmt(i.shares * i.pricePerShare)}</div>
              <button onClick={() => removeItem(i.animalId)} className="border border-ink/20 text-xs px-3 py-1.5 rounded-md">Remove</button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-ink/10 rounded-xl p-6">
          <div className="flex justify-between py-2 text-sm"><span>Subtotal</span><span className="font-mono">{fmt(total)}</span></div>
          <div className="flex justify-between py-2 text-sm"><span>Delivery</span><span className="font-mono">Free</span></div>
          <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-forest mt-2"><span>Total</span><span className="font-mono">{fmt(total)}</span></div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-gold text-forestDark font-semibold py-2.5 rounded-md mt-4">Checkout</button>
        </div>
      </div>
    </div>
  );
}
