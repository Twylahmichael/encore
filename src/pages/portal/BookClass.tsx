import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useMemberAuth } from '../../lib/useMemberAuth';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Slot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  class_name: string;
  coaches: { name: string } | null;
}

function nextDateOn(dayOfWeek: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const diff = (dayOfWeek - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function BookClass() {
  const { member } = useMemberAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('class_slots')
      .select('id, day_of_week, start_time, end_time, class_name, coaches(name)')
      .eq('active', true)
      .order('day_of_week')
      .order('start_time')
      .then(({ data }) => setSlots((data as unknown as Slot[]) ?? []));
  }, []);

  const book = async (slot: Slot) => {
    if (!member) return;
    const sessionDate = nextDateOn(slot.day_of_week);
    const key = `${slot.id}:${sessionDate}`;
    setBusyKey(key);
    setError('');
    setMessage('');

    const { error } = await supabase.from('bookings').insert({
      slot_id: slot.id,
      session_date: sessionDate,
      member_id: member.id,
      member_name: member.name,
      member_phone: member.phone,
      source: 'portal',
      status: 'confirmed',
    });

    if (error) {
      setError(error.message.includes('duplicate') ? 'You already have a booking for this class.' : error.message);
    } else {
      setMessage(`Booked ${slot.class_name} on ${sessionDate}.`);
    }
    setBusyKey(null);
  };

  const byDay: Slot[][] = Array.from({ length: 7 }, () => []);
  for (const s of slots) byDay[s.day_of_week].push(s);

  return (
    <div>
      <h1 className="text-2xl mb-2">Book a Class</h1>
      <p className="text-sm text-efn-black/60 mb-8">Books the next occurrence of that class.</p>
      {message && <p className="text-efn-green mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {byDay.flatMap((daySlots) =>
          daySlots.map((s) => {
            const sessionDate = nextDateOn(s.day_of_week);
            const key = `${s.id}:${sessionDate}`;
            return (
              <div key={s.id} className="bg-efn-offwhite p-5">
                <p className="text-xs uppercase tracking-wide text-efn-green font-semibold mb-1">{DAYS[s.day_of_week]} · {sessionDate}</p>
                <p className="text-lg font-semibold mb-1">{s.class_name}</p>
                <p className="text-sm text-efn-black/60 mb-1">{s.start_time}–{s.end_time}</p>
                <p className="text-sm text-efn-black/60 mb-4">{s.coaches?.name ?? 'Coach TBA'}</p>
                <button onClick={() => book(s)} disabled={busyKey === key} className="btn-solid text-sm px-4 py-2">
                  {busyKey === key ? '…' : 'Book'}
                </button>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
