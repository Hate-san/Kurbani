import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { fmt, EMOJI } from '../components/AnimalCard';

const CATS = ['Cow', 'Goat', 'Sheep', 'Camel'];
const EMPTY_FORM = { title: '', category: 'Cow', breed: '', age: '', weight: '', farm_location: '', price_per_share: '', total_shares: 1, description: '' };

function StatCard({ num, label }) {
  return (
    <div className="bg-forest text-paper rounded-lg p-4">
      <div className="font-mono text-2xl font-semibold text-goldLight">{num}</div>
      <div className="text-[11px] uppercase tracking-wide mt-1 opacity-85">{label}</div>
    </div>
  );
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function loadData() {
    client.get(`/animals?farmerId=${user.id}`).then((res) => setAnimals(res.data.animals));
    client.get('/orders/farmer/mine').then((res) => setOrderItems(res.data.items));
  }

  useEffect(loadData, [user.id]);

  const income = orderItems.reduce((sum, it) => sum + Number(it.subtotal), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.title || !form.breed || !form.farm_location || !form.price_per_share) {
      setError('Please fill in the required fields');
      return;
    }
    setBusy(true);
    try {
      await client.post('/animals', {
        ...form,
        weight: parseFloat(form.weight) || 0,
        price_per_share: parseFloat(form.price_per_share),
        total_shares: Math.min(7, Math.max(1, parseInt(form.total_shares, 10) || 1)),
      });
      setForm(EMPTY_FORM);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not list animal');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    await client.delete(`/animals/${id}`);
    loadData();
  }

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-xs uppercase tracking-widest text-ink/50 block mb-1">Farmer dashboard</span>
        <h2 className="font-display text-2xl">My animals</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <StatCard num={animals.length} label="Listings" />
        <StatCard num={animals.filter((a) => a.status === 'available').length} label="Active" />
        <StatCard num={orderItems.length} label="Orders" />
        <StatCard num={fmt(income)} label="Income" />
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-5 mb-6 overflow-x-auto">
        {animals.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b-2 border-forest">
                <th className="p-2">Animal</th><th className="p-2">Category</th><th className="p-2">Price/share</th>
                <th className="p-2">Shares sold</th><th className="p-2">Status</th><th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {animals.map((a) => (
                <tr key={a.id} className="border-b border-ink/10 last:border-0">
                  <td className="p-2">{EMOJI[a.category]} {a.title}</td>
                  <td className="p-2">{a.category}</td>
                  <td className="p-2 font-mono">{fmt(a.price_per_share)}</td>
                  <td className="p-2 font-mono">{a.total_shares - a.available_shares}/{a.total_shares}</td>
                  <td className="p-2">
                    <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${a.status === 'sold' ? 'bg-rust/10 text-rust' : 'bg-green-700/10 text-green-800'}`}>{a.status}</span>
                  </td>
                  <td className="p-2"><button onClick={() => handleDelete(a.id)} className="border border-ink/20 text-xs px-3 py-1.5 rounded-md">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-ink/40"><div className="text-3xl mb-2">🐄</div>You haven't listed any animals yet.</div>
        )}
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Add new animal</h3>
        {error && <div className="bg-rust/10 text-rust text-sm rounded-md px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <Field label="Name"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="e.g. Kalobondhu" /></Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <Field label="Breed"><input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="input" placeholder="e.g. Black Bengal" /></Field>
            <Field label="Farm location"><input value={form.farm_location} onChange={(e) => setForm({ ...form, farm_location: e.target.value })} className="input" placeholder="e.g. Savar, Dhaka" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <Field label="Age"><input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="input" placeholder="e.g. 2 yrs" /></Field>
            <Field label="Weight (kg)"><input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="input" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
            <Field label="Price per share (৳)"><input type="number" value={form.price_per_share} onChange={(e) => setForm({ ...form, price_per_share: e.target.value })} className="input" /></Field>
            <Field label="Total shares (1 = sold whole)"><input type="number" min="1" max="7" value={form.total_shares} onChange={(e) => setForm({ ...form, total_shares: e.target.value })} className="input" /></Field>
          </div>
          <Field label="Description"><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" /></Field>
          <button disabled={busy} className="bg-gold text-forestDark font-semibold px-5 py-2.5 rounded-md mt-4 disabled:opacity-50">
            {busy ? 'Listing…' : 'List animal'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">{label}</label>
      {children}
    </div>
  );
}
