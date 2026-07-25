import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white border border-ink/10 rounded-xl p-8 mt-6">
      <h2 className="font-display text-2xl mb-1">Sign in</h2>
      <p className="text-ink/50 text-sm mb-6">Welcome back to Agro Kurbani.</p>

      {error && <div className="bg-rust/10 text-rust text-sm rounded-md px-3 py-2 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Email</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Password</label>
          <input
            type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-ink/20 rounded-md px-3 py-2 focus:outline-gold"
          />
        </div>
        <button disabled={busy} className="w-full bg-gold text-forestDark font-semibold py-2.5 rounded-md disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-5 text-center">
        No account? <Link to="/register" className="text-forest font-semibold underline">Register</Link>
      </p>
      <p className="text-xs text-ink/40 mt-4 text-center">
        Demo accounts (password: <span className="font-mono">password123</span>): admin@agrokurbani.com · karim@farm.com (farmer) · nusrat@example.com (customer)
      </p>
    </div>
  );
}
