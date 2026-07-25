import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white border border-ink/10 rounded-xl p-8 mt-6">
      <h2 className="font-display text-2xl mb-1">Create an account</h2>
      <p className="text-ink/50 text-sm mb-6">Join as a customer or a farmer.</p>

      {error && <div className="bg-rust/10 text-rust text-sm rounded-md px-3 py-2 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Full name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">I am a</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold">
            <option value="customer">Customer — buying shares/animals</option>
            <option value="farmer">Farmer — listing animals</option>
          </select>
        </div>
        <button disabled={busy} className="w-full bg-gold text-forestDark font-semibold py-2.5 rounded-md disabled:opacity-50">
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-5 text-center">
        Already have an account? <Link to="/login" className="text-forest font-semibold underline">Sign in</Link>
      </p>
    </div>
  );
}
