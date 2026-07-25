import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles: optional array e.g. ['farmer','admin']. Omit to just require any login.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20 text-ink/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
