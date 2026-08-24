import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart, cartLineProducts } from '../lib/cartStore';
import { supabase } from '../lib/supabase';
import { useSettings } from '../lib/useSettings';

// Real checkout against this app's own Supabase `orders`/`order_items`
// tables — not WooCommerce. No payment gateway is wired (the live site's
// real checkout is WooCommerce + whatever gateway it's configured with,
// which this replica doesn't touch); this records the order as
// "pending_payment" and shows an M-Pesa-style manual instruction, matching
// how a small Kenyan shop actually collects payment.
export function Checkout() {
  const { lines, subtotalKes, clear, priceFor } = useCart();
  const items = cartLineProducts(lines);
  const settings = useSettings();
  const till = settings['mpesa.till_number'];
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [paidByMpesa, setPaidByMpesa] = useState(true);
  const [error, setError] = useState('');

  const [discountCode, setDiscountCode] = useState('');
  const [discountKes, setDiscountKes] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [checkingCode, setCheckingCode] = useState(false);

  if (items.length === 0 && !orderRef) {
    return <Navigate to="/cart" replace />;
  }

  const total = Math.max(0, subtotalKes - discountKes);

  const applyDiscountCode = async () => {
    const code = discountCode.trim();
    if (!code) return;
    setCheckingCode(true);
    setDiscountMessage('');
    const { data, error } = await supabase
      .from('discount_codes')
      .select('code, percent_off, amount_off_kes')
      .eq('code', code)
      .maybeSingle();
    // RLS already scopes reads to active, non-expired codes — a missing
    // row means invalid/expired/inactive, not necessarily "never existed".
    if (error || !data) {
      setDiscountKes(0);
      setDiscountMessage('That code isn’t valid or has expired.');
    } else {
      const amount = data.percent_off != null
        ? Math.round(subtotalKes * (Number(data.percent_off) / 100))
        : Number(data.amount_off_kes);
      setDiscountKes(amount);
      setDiscountMessage(`Code applied — KShs ${amount.toLocaleString('en-KE')} off.`);
    }
    setCheckingCode(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const paymentMethod = String(form.get('payment_method'));
    setPaidByMpesa(paymentMethod === 'mpesa');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: String(form.get('name')),
        customer_email: String(form.get('email')),
        customer_phone: String(form.get('phone')),
        shipping_address: String(form.get('address')),
        subtotal_kes: total,
        payment_method: paymentMethod,
        discount_code: discountKes > 0 ? discountCode.trim() : null,
        discount_amount_kes: discountKes,
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
      unit_price_kes: priceFor(product),
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
          {paidByMpesa && till ? (
            <p className="text-efn-black/70 mb-8">
              Pay via M-Pesa — <strong>Till No: {till}</strong> — then we'll confirm and get your order moving.
            </p>
          ) : (
            <p className="text-efn-black/70 mb-8">
              We'll be in touch on WhatsApp/phone to confirm your order and arrange payment.
            </p>
          )}
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
            <label className="block">
              <span className="block text-sm mb-1">Payment Method</span>
              <select name="payment_method" defaultValue="mpesa" className="w-full border border-efn-gray px-4 py-3">
                <option value="mpesa">M-Pesa</option>
                <option value="cash">Cash</option>
              </select>
            </label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-solid w-full">
              {submitting ? 'Placing order…' : `Place Order — KShs ${total.toLocaleString('en-KE')}`}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.slug} className="flex justify-between text-sm">
                <span>{product.name} × {quantity}</span>
                <span>KShs {(priceFor(product) * quantity).toLocaleString('en-KE')}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount code"
              className="flex-1 border border-efn-gray px-3 py-2 text-sm"
            />
            <button type="button" onClick={applyDiscountCode} disabled={checkingCode || !discountCode.trim()} className="btn-outline-dark text-sm px-4">
              {checkingCode ? '…' : 'Apply'}
            </button>
          </div>
          {discountMessage && (
            <p className={`text-sm mb-4 ${discountKes > 0 ? 'text-efn-green' : 'text-red-600'}`}>{discountMessage}</p>
          )}

          <div className="space-y-1 pt-4 border-t border-efn-gray/30">
            <div className="flex justify-between text-sm text-efn-black/60">
              <span>Subtotal</span>
              <span>KShs {subtotalKes.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
            {discountKes > 0 && (
              <div className="flex justify-between text-sm text-efn-green">
                <span>Discount</span>
                <span>−KShs {discountKes.toLocaleString('en-KE')}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-1">
              <span>Total</span>
              <span>KShs {total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
