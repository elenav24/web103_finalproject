import { Outlet, Navigate } from 'react-router';
import { Navbar } from './components/Navbar';
import SignUp from './pages/SignUp';
import DashboardPage from './pages/Dashboard';
import ContactsPage from './pages/Contacts';
import ContactDetailPage from './pages/ContactDetail';
import { useApp } from './useApp';
import './routes.css';

export function Root() {
  const { user, loading } = useApp();

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function ProtectedRouteWrapper({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useApp();

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return <Component />;
}

export function ProtectedDashboard() {
  return <ProtectedRouteWrapper component={DashboardPage} />;
}

export function ProtectedContacts() {
  return <ProtectedRouteWrapper component={ContactsPage} />;
}

export function ProtectedContactDetail() {
  return <ProtectedRouteWrapper component={ContactDetailPage} />;
}

export function SignUpOrDashboard() {
  const { user, loading } = useApp();

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <SignUp />;
}

export function NotFound() {
  return (
    <div className="page-container">
      <div className="page-error">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}
