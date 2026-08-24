import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DayRevenue {
  date: string;
  totalKes: number;
  orderCount: number;
}

export function Revenue() {
  const [days, setDays] = useState<DayRevenue[]>([]);
  const [byMethod, setByMethod] = useState<Record<string, { count: number; totalKes: number }>>({});
  const [rangeDays, setRangeDays] = useState(14);

  useEffect(() => {
    const from = new Date(Date.now() - rangeDays * 86400_000).toISOString().slice(0, 10);
    supabase
      .from('orders')
      .select('created_at, subtotal_kes, payment_method')
      .gte('created_at', from)
      .then(({ data }) => {
        const rows = data ?? [];
        const byDate = new Map<string, DayRevenue>();
        const methods: Record<string, { count: number; totalKes: number }> = {};
        for (const r of rows) {
          const date = String(r.created_at).slice(0, 10);
          const amount = Number(r.subtotal_kes);
          const entry = byDate.get(date) ?? { date, totalKes: 0, orderCount: 0 };
          entry.totalKes += amount;
          entry.orderCount += 1;
          byDate.set(date, entry);

          const method = r.payment_method ?? 'unknown';
          methods[method] ??= { count: 0, totalKes: 0 };
          methods[method].count += 1;
          methods[method].totalKes += amount;
        }
        setDays([...byDate.values()].sort((a, b) => b.date.localeCompare(a.date)));
        setByMethod(methods);
      });
  }, [rangeDays]);

  const total = days.reduce((sum, d) => sum + d.totalKes, 0);

  return (
    <div>
      <h1 className="text-2xl mb-2">Revenue</h1>
      <p className="text-sm text-efn-black/60 mb-6">Shop orders only — no membership/booking pricing is tracked yet (flagged in docs/COMPARISON.md).</p>

      <div className="flex gap-2 mb-6 text-sm">
        {[7, 14, 30].map((n) => (
          <button
            key={n}
            onClick={() => setRangeDays(n)}
            className={`px-3 py-1.5 border ${rangeDays === n ? 'bg-efn-green text-efn-white border-efn-green' : 'border-efn-gray'}`}
          >
            {n}d
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-efn-offwhite p-6 mb-6">
            <p className="text-3xl font-heading font-bold text-efn-green-deep">KES {total.toLocaleString('en-KE')}</p>
            <p className="text-sm text-efn-black/60">Total over last {rangeDays} days</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-efn-black/60 border-b border-efn-gray/30">
                <th className="py-2">Date</th>
                <th className="py-2">Orders</th>
                <th className="py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date} className="border-b border-efn-gray/10">
                  <td className="py-2">{d.date}</td>
                  <td className="py-2">{d.orderCount}</td>
                  <td className="py-2">KES {d.totalKes.toLocaleString('en-KE')}</td>
                </tr>
              ))}
              {days.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center text-efn-black/50">No orders in this range.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Payment Methods</h2>
          {Object.keys(byMethod).length === 0 ? (
            <p className="text-sm text-efn-black/50">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(byMethod).map(([method, m]) => (
                <li key={method} className="flex justify-between bg-efn-offwhite px-4 py-3 text-sm capitalize">
                  <span>{method} ({m.count})</span>
                  <span>KES {m.totalKes.toLocaleString('en-KE')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
