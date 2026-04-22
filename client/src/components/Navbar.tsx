import { Link, useLocation } from 'react-router';
import './navbar.css';

export function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isContacts = location.pathname.startsWith('/contacts');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">GiftGiver</Link>
      <div className="navbar-links">
        <Link to="/" className={`navbar-link${isDashboard ? ' active' : ''}`}>Dashboard</Link>
        <Link to="/contacts" className={`navbar-link${isContacts ? ' active' : ''}`}>Contacts</Link>
        <div className="navbar-avatar">
          <span>GG</span>
        </div>
      </div>
    </nav>
  );
}
