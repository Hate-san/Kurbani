import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { fmt } from '../components/AnimalCard';

function Badge({ status }) {
  const map = {
    processing: 'bg-gold/20 text-[#8a6a1f]',
    shipping: 'bg-blue-700/10 text-blue-800',
    delivered: 'bg-green-700/10 text-green-800',
    paid: 'bg-green-700/10 text-green-800',
    pending: 'bg-rust/10 text-rust',
    failed: 'bg-rust/10 text-rust',
  };
  return <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${map[status] || 'bg-ink/10'}`}>{status}</span>;
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/orders').then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-ink/50 block mb-1">Customer dashboard</span>
          <h2 className="font-display text-2xl">My orders</h2>
        </div>
        <Link to="/animals" className="border border-ink/20 text-sm px-4 py-2 rounded-md">Browse more animals</Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink/40">Loading…</div>
      ) : orders.length ? (
        <div className="bg-white border border-ink/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b-2 border-forest">
                <th className="p-3">Order</th><th className="p-3">Items</th><th className="p-3">Total</th>
                <th className="p-3">Payment</th><th className="p-3">Delivery</th><th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/10 last:border-0">
                  <td className="p-3 font-mono">#{o.id}</td>
                  <td className="p-3">{o.items.map((i) => `${i.animal?.title} ×${i.shares}`).join(', ')}</td>
                  <td className="p-3 font-mono">{fmt(o.total_price)}</td>
                  <td className="p-3"><Badge status={o.payment_status} /></td>
                  <td className="p-3"><Badge status={o.delivery_status} /></td>
                  <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-ink/40">
          <div className="text-4xl mb-3">📦</div>No orders yet.
        </div>
      )}
    </div>
  );
}
