import { useEffect, useState } from 'react';
import client from '../api/client';
import { fmt, EMOJI } from '../components/AnimalCard';

function StatCard({ num, label }) {
  return (
    <div className="bg-forest text-paper rounded-lg p-4">
      <div className="font-mono text-2xl font-semibold text-goldLight">{num}</div>
      <div className="text-[11px] uppercase tracking-wide mt-1 opacity-85">{label}</div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    processing: 'bg-gold/20 text-[#8a6a1f]',
    shipping: 'bg-blue-700/10 text-blue-800',
    delivered: 'bg-green-700/10 text-green-800',
    paid: 'bg-green-700/10 text-green-800',
    pending: 'bg-rust/10 text-rust',
    failed: 'bg-rust/10 text-rust',
    sold: 'bg-rust/10 text-rust',
    available: 'bg-green-700/10 text-green-800',
  };
  return <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${map[status] || 'bg-ink/10'}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [totals, setTotals] = useState({ users: 0, animals: 0, orders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [animals, setAnimals] = useState([]);

  function loadData() {
    client.get('/admin/reports').then((res) => setTotals(res.data.totals));
    client.get('/admin/orders').then((res) => setOrders(res.data.orders));
    client.get('/animals').then((res) => setAnimals(res.data.animals));
  }

  useEffect(loadData, []);

  async function handleDelete(id) {
    await client.delete(`/animals/${id}`);
    loadData();
  }

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-xs uppercase tracking-widest text-ink/50 block mb-1">Admin dashboard</span>
        <h2 className="font-display text-2xl">Marketplace overview</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-6">
        <StatCard num={totals.animals} label="Listings" />
        <StatCard num={totals.orders} label="Orders" />
        <StatCard num={new Set(animals.map((a) => a.farmer?.id)).size} label="Farmers" />
        <StatCard num={totals.users} label="Users" />
        <StatCard num={fmt(totals.revenue)} label="Revenue" />
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-5 mb-6 overflow-x-auto">
        <h3 className="font-semibold mb-4">All orders</h3>
        {orders.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b-2 border-forest">
                <th className="p-2">Order</th><th className="p-2">Customer</th><th className="p-2">Items</th>
                <th className="p-2">Total</th><th className="p-2">Payment</th><th className="p-2">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/10 last:border-0">
                  <td className="p-2 font-mono">#{o.id}</td>
                  <td className="p-2">{o.customer?.name}</td>
                  <td className="p-2">{o.items.map((i) => i.animal?.title).join(', ')}</td>
                  <td className="p-2 font-mono">{fmt(o.total_price)}</td>
                  <td className="p-2"><Badge status={o.payment_status} /></td>
                  <td className="p-2"><Badge status={o.delivery_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="text-center py-8 text-ink/40">No orders yet.</div>}
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-5 overflow-x-auto">
        <h3 className="font-semibold mb-4">All animals</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b-2 border-forest">
              <th className="p-2">Animal</th><th className="p-2">Farmer</th><th className="p-2">Category</th>
              <th className="p-2">Shares sold</th><th className="p-2">Status</th><th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {animals.map((a) => (
              <tr key={a.id} className="border-b border-ink/10 last:border-0">
                <td className="p-2">{EMOJI[a.category]} {a.title}</td>
                <td className="p-2">{a.farmer?.name}</td>
                <td className="p-2">{a.category}</td>
                <td className="p-2 font-mono">{a.total_shares - a.available_shares}/{a.total_shares}</td>
                <td className="p-2"><Badge status={a.status} /></td>
                <td className="p-2"><button onClick={() => handleDelete(a.id)} className="border border-ink/20 text-xs px-3 py-1.5 rounded-md">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
