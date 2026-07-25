import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import FarmerDashboard from './FarmerDashboard';
import AdminDashboard from './AdminDashboard';

// Routes to the right dashboard based on the signed-in user's role.
export default function Dashboard() {
  const { user } = useAuth();
  if (user.role === 'farmer') return <FarmerDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <CustomerDashboard />;
}
