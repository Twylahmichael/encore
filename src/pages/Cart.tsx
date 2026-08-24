import { Link } from 'react-router-dom';
import { useCart, cartLineProducts } from '../lib/cartStore';

// A real, working cart (against this app's own Supabase `orders` table at
// checkout) — not a WooCommerce clone. The live site's actual cart/checkout
// is WooCommerce and this doesn't touch it; see docs/COMPARISON.md.
export function Cart() {
  const { lines, setQuantity, remove, subtotalKes } = useCart();
  const items = cartLineProducts(lines);

  if (items.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-site mx-auto px-6 text-center">
          <h1 className="text-3xl mb-4">Your cart is empty</h1>
          <Link to="/our-products" className="btn-solid inline-block mt-4">Browse Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <h1 className="text-3xl md:text-4xl mb-10">Cart</h1>

        <div className="overflow-x-auto mb-10">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-efn-gray/30 text-left text-sm text-efn-black/60">
                <th className="pb-3">Product</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Subtotal</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ product, quantity }) => (
                <tr key={product.slug} className="border-b border-efn-gray/10">
                  <td className="py-4">
                    <Link to={`/product/${product.slug}`} className="flex items-center gap-4 hover:text-efn-green">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                      <span>{product.name}</span>
                    </Link>
                  </td>
                  <td className="py-4">KShs {product.priceKes.toLocaleString('en-KE')}</td>
                  <td className="py-4">
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(product.slug, Number(e.target.value))}
                      className="w-16 border border-efn-gray px-2 py-1"
                    />
                  </td>
                  <td className="py-4">KShs {(product.priceKes * quantity).toLocaleString('en-KE')}</td>
                  <td className="py-4">
                    <button onClick={() => remove(product.slug)} className="text-efn-black/50 hover:text-efn-green" aria-label={`Remove ${product.name}`}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex justify-between py-3 border-t border-efn-gray/30 text-lg font-semibold">
              <span>Subtotal</span>
              <span>KShs {subtotalKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
            <Link to="/checkout" className="btn-solid w-full text-center block mt-4">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
