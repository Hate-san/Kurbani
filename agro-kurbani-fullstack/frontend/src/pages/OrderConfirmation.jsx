import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { fmt } from '../components/AnimalCard';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err.response?.data?.message || 'Order not found'));
  }, [id]);

  if (error) return <div className="text-center py-16 text-ink/40">{error}</div>;
  if (!order) return <div className="text-center py-16 text-ink/40">Loading…</div>;

  return (
    <div className="max-w-lg mx-auto bg-white border border-ink/10 rounded-xl p-8 text-center mt-4">
      <div className="text-5xl">🎉</div>
      <h2 className="font-display text-2xl mt-3 mb-1">Order placed</h2>
      <p className="text-ink/50">
        Your Kurbani order <span className="font-mono">#{order.id}</span> has been confirmed.
      </p>
      <div className="border-t border-ink/10 my-5" />
      <div className="text-left">
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between text-sm py-1.5">
            <span>{it.animal?.title} × {it.shares}</span>
            <span className="font-mono">{fmt(it.subtotal)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-forest mt-2">
        <span>Total</span><span className="font-mono">{fmt(order.total_price)}</span>
      </div>
      <Link to="/dashboard" className="inline-block bg-gold text-forestDark font-semibold px-5 py-2.5 rounded-md mt-4">
        Go to my orders
      </Link>
    </div>
  );
}
