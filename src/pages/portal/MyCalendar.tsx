import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useMemberAuth } from '../../lib/useMemberAuth';

interface BookingRow {
  id: string;
  session_date: string;
  status: string;
  class_slots: { class_name: string; start_time: string; end_time: string } | null;
}

export function MyCalendar() {
  const { member } = useMemberAuth();
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    if (!member) return;
    const { data } = await supabase
      .from('bookings')
      .select('id, session_date, status, class_slots(class_name, start_time, end_time)')
      .eq('member_id', member.id)
      .order('session_date');
    setRows((data as unknown as BookingRow[]) ?? []);
  };

  useEffect(() => { load(); }, [member]);

  const cancel = async (id: string) => {
    setBusyId(id);
    await supabase.from('bookings').update({ status: 'cancelled', cancelled_at: new Date().toISOString() }).eq('id', id);
    await load();
    setBusyId(null);
  };

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = rows.filter((r) => r.session_date >= today && r.status === 'confirmed');
  const past = rows.filter((r) => r.session_date < today || r.status !== 'confirmed');

  return (
    <div>
      <h1 className="text-2xl mb-8">My Calendar</h1>

      <h2 className="font-semibold mb-4">Upcoming</h2>
      {upcoming.length === 0 ? (
        <div className="bg-efn-offwhite p-6 mb-10">
          <p className="mb-4">No upcoming bookings.</p>
          <Link to="/my-encore/book" className="btn-solid inline-block">Book a Class →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {upcoming.map((b) => (
            <div key={b.id} className="bg-efn-offwhite p-5">
              <p className="text-xs uppercase tracking-wide text-efn-green font-semibold mb-1">{b.session_date}</p>
              <p className="text-lg font-semibold mb-1">{b.class_slots?.class_name}</p>
              <p className="text-sm text-efn-black/60 mb-4">{b.class_slots?.start_time}–{b.class_slots?.end_time}</p>
              <button onClick={() => cancel(b.id)} disabled={busyId === b.id} className="text-sm text-efn-black/60 hover:text-efn-green underline">
                {busyId === b.id ? '…' : 'Cancel'}
              </button>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="font-semibold mb-4">History</h2>
          <ul className="space-y-2 text-sm">
            {past.map((b) => (
              <li key={b.id} className="flex justify-between bg-efn-offwhite/50 px-4 py-2">
                <span>{b.session_date} — {b.class_slots?.class_name}</span>
                <span className="text-efn-black/50">{b.status}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
