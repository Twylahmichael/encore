import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  subtotal_kes: number;
  payment_method: string | null;
  status: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-efn-green/20 text-efn-green-deep',
  fulfilled: 'bg-efn-gray/30 text-efn-black',
  cancelled: 'bg-red-100 text-red-700',
};

export function Sales() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [from, setFrom] = useState(new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date(Date.now() + 86400_000).toISOString().slice(0, 10));
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, created_at, customer_name, subtotal_kes, payment_method, status')
      .gte('created_at', from)
      .lt('created_at', to)
      .order('created_at', { ascending: false });
    setOrders((data as OrderRow[]) ?? []);
  };

  useEffect(() => { load(); }, [from, to]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await supabase.from('orders').update({ status }).eq('id', id);
    await load();
    setUpdatingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl mb-2">Sales</h1>
      <p className="text-sm text-efn-black/60 mb-6">All shop orders (product purchases). Bookings are tracked separately under Bookings.</p>

      <div className="flex gap-4 mb-6 text-sm">
        <label className="flex items-center gap-2">From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-efn-gray px-2 py-1" /></label>
        <label className="flex items-center gap-2">To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-efn-gray px-2 py-1" /></label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-sm text-efn-black/60 border-b border-efn-gray/30">
              <th className="py-2 pr-4">Ref</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Payment</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-efn-gray/10 text-sm">
                <td className="py-3 pr-4 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="py-3 pr-4">{o.customer_name}</td>
                <td className="py-3 pr-4">KES {Number(o.subtotal_kes).toLocaleString('en-KE')}</td>
                <td className="py-3 pr-4 capitalize">{o.payment_method ?? '—'}</td>
                <td className="py-3 pr-4">
                  <select
                    value={o.status}
                    disabled={updatingId === o.id}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded border-0 font-semibold uppercase ${STATUS_STYLE[o.status] ?? ''}`}
                  >
                    <option value="pending_payment">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-efn-black/50">No orders in this range.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
