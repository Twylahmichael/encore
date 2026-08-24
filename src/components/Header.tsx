import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/site/logo.png';
import { useCart } from '../lib/cartStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/our-products', label: 'Our Products' },
  { to: '/fitness-studio', label: 'Fitness Studio' },
  { to: '/contacts', label: 'Contacts' },
];

// Matches efn.co.ke's live Blocksy header exactly: logo left, centered nav,
// search / login / cart icons right. Sticky, white background, black text.
export function Header() {
  const { subtotalKes } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-efn-white border-b border-efn-offwhite">
      <div className="max-w-site mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Encore Fitness Studio" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `hover:text-efn-green transition-colors ${isActive ? 'text-efn-green' : 'text-efn-black'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <button aria-label="Search" className="hover:text-efn-green">
            <SearchIcon />
          </button>
          {/* "My Encore" is a Phase 2 addition (member portal) — not on the
              live site's real header, which only has Login/Search/Cart. */}
          <Link to="/my-encore" className="hidden sm:inline hover:text-efn-green">My Encore</Link>
          <Link to="/login" className="hover:text-efn-green">Login</Link>
          <Link to="/cart" className="flex items-center gap-2 hover:text-efn-green">
            <CartIcon />
            <span>KShs {subtotalKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
