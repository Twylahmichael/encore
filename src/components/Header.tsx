import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/site/logo.png';
import { useCart, cartLineProducts } from '../lib/cartStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/our-products', label: 'Our Products' },
  { to: '/fitness-studio', label: 'Fitness Studio' },
  { to: '/contacts', label: 'Contacts' },
];

// Matches efn.co.ke's live Blocksy header exactly: logo left, centered nav,
// search / login / cart icons right. Sticky, white background, black text.
export function Header() {
  const { lines, subtotalKes, remove, priceFor } = useCart();
  const items = cartLineProducts(lines);
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
              live site's real header, which only has Login/Search/Cart.
              It replaces that generic "Login" link: the portal is a real,
              working account page (calendar, bookings, subscription,
              coach view) — the old /login page just said "Signed in." and
              did nothing else, so it's retired (redirects here now). */}
          <Link to="/my-encore" className="hover:text-efn-green">My Encore</Link>

          {/* Hover mini-cart, matching the live site's WooCommerce cart
              preview — the "pt-3" wrapper closes the gap between the
              trigger and the panel so group-hover doesn't drop out while
              moving the mouse down into it. */}
          <div className="relative group">
            <Link to="/cart" className="flex items-center gap-2 hover:text-efn-green">
              <CartIcon />
              <span>KShs {subtotalKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </Link>

            {items.length > 0 && (
              <div className="absolute right-0 top-full pt-3 hidden group-hover:block z-50">
                <div className="w-96 bg-efn-white border border-efn-gray/20 shadow-lg p-4">
                  <ul className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map(({ product, quantity }) => (
                      <li key={product.slug} className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{product.name}</p>
                          <p className="text-xs text-efn-black/60">
                            {quantity} × KShs {priceFor(product).toLocaleString('en-KE')}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(product.slug)}
                          aria-label={`Remove ${product.name}`}
                          className="text-efn-black/40 hover:text-red-600 shrink-0"
                        >
                          <TrashIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-sm font-semibold border-t border-efn-gray/20 mt-3 pt-3">
                    <span>Subtotal</span>
                    <span>KShs {subtotalKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to="/cart" className="btn-outline-dark flex-1 text-center text-xs px-2 py-2 whitespace-nowrap">View Cart</Link>
                    <Link to="/checkout" className="btn-solid flex-1 text-center text-xs px-2 py-2 whitespace-nowrap">Checkout</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
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

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
