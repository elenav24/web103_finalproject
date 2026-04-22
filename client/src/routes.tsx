import { createBrowserRouter, Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import DashboardPage from './pages/Dashboard';
import ContactsPage from './pages/Contacts';
import ContactDetailPage from './pages/ContactDetail';

function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-white pt-[60px] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[30px] font-semibold text-[#0a0a0a] mb-2">Page Not Found</h1>
        <p className="text-[16px] text-[#717182]">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'contacts', Component: ContactsPage },
      { path: 'contacts/:id', Component: ContactDetailPage },
      { path: '*', Component: NotFound },
    ],
  },
]);
