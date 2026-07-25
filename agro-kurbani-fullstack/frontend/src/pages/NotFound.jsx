import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="text-5xl mb-3">🌾</div>
      <h2 className="font-display text-2xl mb-2">Page not found</h2>
      <p className="text-ink/50 mb-5">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-gold text-forestDark font-semibold px-5 py-2.5 rounded-md">Back to home</Link>
    </div>
  );
}
