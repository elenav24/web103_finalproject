import { Link, useLocation, useNavigate } from 'react-router';
import './Navbar.css';
import { useApp } from '../useApp';
import { signOut } from 'firebase/auth';
import { auth } from '../config/auth';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const isDashboard = location.pathname === '/home';
  const isContacts = location.pathname.startsWith('/contacts');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signup');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">GiftGiver</Link>
      <div className="navbar-links">
        {user && (
          <>
            <Link to="/home" className={`navbar-link${isDashboard ? ' active' : ''}`}>Dashboard</Link>
            <Link to="/contacts" className={`navbar-link${isContacts ? ' active' : ''}`}>Contacts</Link>
            <div className="navbar-avatar">
              {user.photoURL
                ? <img src={user.photoURL} alt="Profile" className="navbar-avatar-img" referrerPolicy="no-referrer" />
                : <span>{user.displayName ? `${user.displayName.split(' ')[0][0]}${user.displayName.split(' ').at(-1)?.[0] ?? ''}`.toUpperCase() : 'U'}</span>
              }
            </div>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
