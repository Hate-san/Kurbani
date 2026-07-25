import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const linkCls = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${location.pathname === path ? 'bg-white/15 text-paper' : 'text-paper/80 hover:text-paper hover:bg-white/10'}`;

  return (
    <header className="bg-forest text-paper sticky top-0 z-50 border-b-[3px] border-gold">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center text-forestDark font-bold -rotate-3 shadow-[2px_2px_0_#152318]">AK</div>
          <div>
            <div className="font-display font-bold text-lg leading-none">Agro Kurbani</div>
            <div className="text-[10px] uppercase tracking-widest text-goldLight">Partial Kurbani Marketplace</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkCls('/')}>Home</Link>
          <Link to="/animals" className={linkCls('/animals')}>Browse Animals</Link>
          {user && <Link to="/dashboard" className={linkCls('/dashboard')}>Dashboard</Link>}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative px-3 py-2 rounded-md text-sm text-paper/80 hover:text-paper hover:bg-white/10">
            Cart
            {count > 0 && (
              <span className="absolute -top-1 right-0 bg-rust text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 font-mono">{count}</span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2 bg-white/10 pl-1.5 pr-3 py-1 rounded-full text-sm">
              <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-forestDark text-xs font-bold">{user.name.charAt(0).toUpperCase()}</div>
              <span>{user.name} <span className="opacity-70 font-mono text-xs">({user.role})</span></span>
              <button
                className="text-paper/70 text-xs ml-1"
                onClick={() => { logout(); navigate('/'); }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="border border-paper/40 text-paper text-sm px-4 py-2 rounded-md hover:bg-white/10">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
