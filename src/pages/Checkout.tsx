import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart, cartLineProducts } from '../lib/cartStore';
import { supabase } from '../lib/supabase';

// Real checkout against this app's own Supabase `orders`/`order_items`
// tables — not WooCommerce. No payment gateway is wired (the live site's
// real checkout is WooCommerce + whatever gateway it's configured with,
// which this replica doesn't touch); this records the order as
// "pending_payment" and shows an M-Pesa-style manual instruction, matching
// how a small Kenyan shop actually collects payment.
export function Checkout() {
  const { lines, subtotalKes, clear } = useCart();
  const items = cartLineProducts(lines);
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (items.length === 0 && !orderRef) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(e.currentTarget);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: String(form.get('name')),
        customer_email: String(form.get('email')),
        customer_phone: String(form.get('phone')),
        shipping_address: String(form.get('address')),
        subtotal_kes: subtotalKes,
        status: 'pending_payment',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      setError(orderError?.message ?? 'Could not create order — please try again.');
      setSubmitting(false);
      return;
    }

    const orderItems = items.map(({ product, quantity }) => ({
      order_id: order.id,
      product_slug: product.slug,
      product_name: product.name,
      unit_price_kes: product.priceKes,
      quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      setError(itemsError.message);
      setSubmitting(false);
      return;
    }

    setOrderRef(order.id);
    clear();
    setSubmitting(false);
  };

  if (orderRef) {
    return (
      <section className="py-16">
        <div className="max-w-site mx-auto px-6 max-w-lg text-center">
          <h1 className="text-3xl mb-4">Order Received</h1>
          <p className="text-efn-black/70 mb-2">Order reference: <span className="font-mono">{orderRef}</span></p>
          <p className="text-efn-black/70 mb-8">
            We'll be in touch on WhatsApp/phone to confirm your order and arrange M-Pesa payment.
          </p>
          <Link to="/our-products" className="btn-solid inline-block">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-3xl mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Full Name</span>
              <input name="name" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Phone Number</span>
              <input type="tel" name="phone" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Delivery Address</span>
              <textarea name="address" required rows={3} className="w-full border border-efn-gray px-4 py-3" />
            </label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-solid w-full">
              {submitting ? 'Placing order…' : `Place Order — KShs ${subtotalKes.toLocaleString('en-KE')}`}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.slug} className="flex justify-between text-sm">
                <span>{product.name} × {quantity}</span>
                <span>KShs {(product.priceKes * quantity).toLocaleString('en-KE')}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-efn-gray/30 font-semibold">
            <span>Total</span>
            <span>KShs {subtotalKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
