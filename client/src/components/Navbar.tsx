import { Link, useLocation } from 'react-router';

export function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const isContacts = location.pathname.startsWith('/contacts');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] h-[60px] flex items-center px-8 justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-white font-semibold text-[20px] tracking-tight">GiftGiver</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className={`text-[14px] font-medium transition-colors ${isDashboard ? 'text-white underline underline-offset-4' : 'text-[#a1a1aa] hover:text-white'}`}
        >
          Dashboard
        </Link>
        <Link
          to="/contacts"
          className={`text-[14px] font-medium transition-colors ${isContacts ? 'text-white underline underline-offset-4' : 'text-[#a1a1aa] hover:text-white'}`}
        >
          Contacts
        </Link>
        <div className="size-[32px] rounded-full bg-[#333] flex items-center justify-center border-2 border-[#555]">
          <span className="text-white text-[11px] font-semibold">GG</span>
        </div>
      </div>
    </nav>
  );
}