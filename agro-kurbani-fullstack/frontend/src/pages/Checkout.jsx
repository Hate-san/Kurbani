import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fmt } from '../components/AnimalCard';

const METHODS = [
  { id: 'sslcommerz', label: 'SSLCommerz', hint: 'Cards, mobile banking, bKash, Nagad' },
  { id: 'stripe', label: 'Stripe', hint: 'International cards' },
  { id: 'cod', label: 'Cash on delivery', hint: 'Pay when meat is delivered' },
];

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', phone: '', payment: 'sslcommerz' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!items.length) return <Navigate to="/cart" replace />;
  if (!user) return <Navigate to="/login" replace />;

  async function placeOrder() {
    if (!form.address || !form.phone) { setError('Please fill in your delivery details'); return; }
    setError('');
    setBusy(true);
    try {
      const res = await client.post('/orders', {
        items: items.map((i) => ({ animal_id: i.animalId, shares: i.shares })),
        payment_method: form.payment,
        delivery_address: form.address,
        delivery_phone: form.phone,
      });
      clear();
      navigate(`/orders/${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
        <div className="bg-white border border-ink/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Delivery details</h3>
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Full name</label>
            <input disabled value={user.name} className="w-full border border-ink/20 rounded-md px-3 py-2 bg-ink/5" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Phone number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold" />
          </div>
          <div className="mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Delivery address</label>
            <textarea rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House, road, area, district" className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold" />
          </div>

          <div className="border-t border-ink/10 mt-5 pt-5">
            <h3 className="font-semibold mb-4">Payment method</h3>
            {METHODS.map((m) => (
              <label key={m.id} className={`flex items-center gap-3 p-3 border rounded-lg mb-2.5 cursor-pointer ${form.payment === m.id ? 'border-forest bg-forest/5' : 'border-ink/20'}`}>
                <input type="radio" checked={form.payment === m.id} onChange={() => setForm({ ...form, payment: m.id })} />
                <div>
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-xs text-ink/50">{m.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Order summary</h3>
          {items.map((i) => (
            <div key={i.animalId} className="flex justify-between text-sm py-1.5">
              <span>{i.title} × {i.shares}</span><span className="font-mono">{fmt(i.shares * i.pricePerShare)}</span>
            </div>
          ))}
          <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-forest mt-2"><span>Total</span><span className="font-mono">{fmt(total)}</span></div>
          {error && <div className="bg-rust/10 text-rust text-sm rounded-md px-3 py-2 mb-2">{error}</div>}
          <button disabled={busy} onClick={placeOrder} className="w-full bg-gold text-forestDark font-semibold py-2.5 rounded-md mt-2 disabled:opacity-50">
            {busy ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </div>
    </div>
  );
}
