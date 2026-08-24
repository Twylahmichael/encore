import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface BookingRow {
  id: string;
  session_date: string;
  member_name: string;
  member_phone: string;
  source: string;
  status: string;
  class_slots: { class_name: string; start_time: string } | null;
}

export function BookingsView() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10));

  useEffect(() => {
    supabase
      .from('bookings')
      .select('id, session_date, member_name, member_phone, source, status, class_slots(class_name, start_time)')
      .gte('session_date', from)
      .lte('session_date', to)
      .order('session_date')
      .then(({ data }) => setRows((data as unknown as BookingRow[]) ?? []));
  }, [from, to]);

  return (
    <div>
      <h1 className="text-2xl mb-2">Bookings</h1>
      <p className="text-sm text-efn-black/60 mb-6">
        Includes member-portal bookings and any walk-ins staff log manually here in future.
      </p>
      <div className="flex gap-4 mb-6 text-sm">
        <label className="flex items-center gap-2">From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-efn-gray px-2 py-1" /></label>
        <label className="flex items-center gap-2">To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-efn-gray px-2 py-1" /></label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-sm text-efn-black/60 border-b border-efn-gray/30">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Class</th>
              <th className="py-2 pr-4">Member</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className={`border-b border-efn-gray/10 ${b.status === 'cancelled' ? 'text-efn-black/40 line-through' : ''}`}>
                <td className="py-2 pr-4">{b.session_date}</td>
                <td className="py-2 pr-4">{b.class_slots?.class_name} {b.class_slots?.start_time}</td>
                <td className="py-2 pr-4">{b.member_name}</td>
                <td className="py-2 pr-4">{b.member_phone}</td>
                <td className="py-2 pr-4">{b.source}</td>
                <td className="py-2 pr-4">{b.status}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-efn-black/50">No bookings in this range.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
