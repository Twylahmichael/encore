import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface UnassignedSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  class_name: string;
}

export function Dashboard() {
  const [bookingsToday, setBookingsToday] = useState<number | null>(null);
  const [bookingsWeek, setBookingsWeek] = useState<number | null>(null);
  const [unassigned, setUnassigned] = useState<UnassignedSlot[]>([]);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const weekAhead = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);

    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('session_date', today).then(({ count }) => setBookingsToday(count ?? 0));

    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .gte('session_date', today).lte('session_date', weekAhead).then(({ count }) => setBookingsWeek(count ?? 0));

    supabase.from('class_slots').select('id, day_of_week, start_time, class_name')
      .is('coach_id', null).eq('active', true).then(({ data }) => setUnassigned((data as UnassignedSlot[]) ?? []));

    supabase.from('orders').select('id', { count: 'exact', head: true })
      .eq('status', 'pending_payment').then(({ count }) => setPendingOrders(count ?? 0));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Bookings today" value={bookingsToday} />
        <StatCard label="Bookings this week" value={bookingsWeek} />
        <StatCard label="Classes missing a coach" value={unassigned.length} alert={unassigned.length > 0} />
        <StatCard label="Orders awaiting payment" value={pendingOrders} />
      </div>

      {unassigned.length > 0 && (
        <div className="bg-efn-offwhite p-6">
          <h2 className="font-semibold mb-4">Needs a coach</h2>
          <ul className="space-y-1 text-sm">
            {unassigned.map((s) => (
              <li key={s.id}>{DAYS[s.day_of_week]} {s.start_time} — {s.class_name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, alert }: { label: string; value: number | null; alert?: boolean }) {
  return (
    <div className={`p-6 ${alert ? 'bg-efn-green/10' : 'bg-efn-offwhite'}`}>
      <p className={`text-4xl font-heading font-bold mb-1 ${alert ? 'text-efn-green-deep' : ''}`}>
        {value ?? '—'}
      </p>
      <p className="text-sm text-efn-black/60">{label}</p>
    </div>
  );
}
