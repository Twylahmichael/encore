import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Slot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  class_name: string;
  coach_id: string | null;
}
interface Coach {
  id: string;
  name: string;
}

// Fast inline coach reassignment — the hot path per the Encore proposal:
// the schedule changes weekly and staff shouldn't need a developer for it.
export function ScheduleManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    const [{ data: slotData }, { data: coachData }] = await Promise.all([
      supabase.from('class_slots').select('id, day_of_week, start_time, end_time, class_name, coach_id').eq('active', true).order('day_of_week').order('start_time'),
      supabase.from('coaches').select('id, name').eq('active', true).order('sort_order'),
    ]);
    setSlots((slotData as Slot[]) ?? []);
    setCoaches((coachData as Coach[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const reassign = async (slotId: string, coachId: string) => {
    setSavingId(slotId);
    await supabase.from('class_slots').update({ coach_id: coachId || null }).eq('id', slotId);
    await load();
    setSavingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl mb-2">Schedule Manager</h1>
      <p className="text-sm text-efn-black/60 mb-8">Reassign a coach inline — changes go live on the site immediately.</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-sm text-efn-black/60 border-b border-efn-gray/30">
              <th className="py-2 pr-4">Day</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Class</th>
              <th className="py-2 pr-4">Coach</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id} className="border-b border-efn-gray/10">
                <td className="py-3 pr-4">{DAYS[s.day_of_week]}</td>
                <td className="py-3 pr-4">{s.start_time}–{s.end_time}</td>
                <td className="py-3 pr-4">{s.class_name}</td>
                <td className="py-3 pr-4">
                  <select
                    value={s.coach_id ?? ''}
                    disabled={savingId === s.id}
                    onChange={(e) => reassign(s.id, e.target.value)}
                    className="border border-efn-gray px-3 py-2"
                  >
                    <option value="">— Unassigned —</option>
                    {coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
