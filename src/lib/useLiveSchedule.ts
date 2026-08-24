import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { schedule as staticSchedule, type ScheduleDay } from '../data/schedule';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface LiveRow {
  day_of_week: number;
  start_time: string;
  end_time: string;
  class_name: string;
  coaches: { name: string } | null;
}

// Morning/Evening labeling matches the live site's own convention: weekday
// sessions (Mon–Fri) are labeled by time of day; Saturday sessions show a
// bare time instead (that's how the live table already reads — "9am",
// "11am – 4pm" with no Morning/Evening prefix).
function timeLabel(dayOfWeek: number, startTime: string): string {
  if (dayOfWeek === 6 || dayOfWeek === 0) return '';
  const hour = Number(startTime.split(':')[0]);
  return hour < 12 ? 'Morning' : 'Evening';
}

function to12h(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hh = ((h + 11) % 12) + 1;
  return m === 0 ? `${hh}${suffix}` : `${hh}:${String(m).padStart(2, '0')}${suffix}`;
}

// Public schedule display now reads live from Supabase (class_slots +
// coaches), so a coach reassignment in the admin panel shows up here
// immediately — no redeploy, matching the whole point of Phase 1. Falls
// back to the static, verbatim-from-the-live-site schedule (no coach
// names — none exist there) while loading or if the fetch fails, so the
// page never shows nothing.
export function useLiveSchedule(): { days: ScheduleDay[]; loading: boolean } {
  const [days, setDays] = useState<ScheduleDay[]>(staticSchedule);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('class_slots')
      .select('day_of_week, start_time, end_time, class_name, coaches(name)')
      .eq('active', true)
      .order('day_of_week')
      .order('start_time')
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) {
          setLoading(false);
          return;
        }
        const rows = data as unknown as LiveRow[];
        const grouped = new Map<number, ScheduleDay>();
        for (const row of rows) {
          const day = grouped.get(row.day_of_week) ?? { day: DAY_NAMES[row.day_of_week], sessions: [] };
          const time = row.start_time === row.end_time
            ? to12h(row.start_time)
            : `${to12h(row.start_time)} – ${to12h(row.end_time)}`;
          day.sessions.push({
            time,
            label: timeLabel(row.day_of_week, row.start_time),
            className: row.class_name,
            coachName: row.coaches?.name,
          });
          grouped.set(row.day_of_week, day);
        }
        const order = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sat, Sun last — matches the static schedule's convention
        setDays(order.map((d) => grouped.get(d)).filter((d): d is ScheduleDay => Boolean(d)));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { days, loading };
}
