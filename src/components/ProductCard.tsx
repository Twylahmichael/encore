import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { useCart } from '../lib/cartStore';

// Was a plain <a href>, not a router Link — that bypasses BrowserRouter's
// basename entirely, so under GitHub Pages (base '/encore/') clicking a
// product card did a full browser navigation straight to
// twylahmichael.github.io/product/<slug> (no /encore/ prefix), which is
// outside where this app is actually hosted → GitHub's real 404 page, no
// React app loaded at all. That's what "can't add to cart" was: there was
// no page there to add to a cart on.
export function ProductCard({ product }: { product: Product }) {
  const { priceFor } = useCart();
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="aspect-square bg-efn-offwhite overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-base font-medium mb-1 group-hover:text-efn-green transition-colors">
        {product.name}
      </h3>
      <p className="text-efn-green font-semibold">
        KShs {priceFor(product).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
      </p>
    </Link>
  );
}
