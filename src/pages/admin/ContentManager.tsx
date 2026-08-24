import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  published: boolean;
}
interface CoachRow {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
}

// Content Manager — events + coaches. (Gallery upload needs file storage,
// which isn't wired up in this pass; the gallery_items table exists and can
// be managed directly in the Supabase dashboard until an upload UI is built.)
export function ContentManager() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [coaches, setCoaches] = useState<CoachRow[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', starts_at: '' });
  const [newCoach, setNewCoach] = useState({ name: '', specialty: '' });

  const load = async () => {
    const [{ data: eventData }, { data: coachData }] = await Promise.all([
      supabase.from('events').select('id, title, description, starts_at, published').order('starts_at'),
      supabase.from('coaches').select('id, name, specialty, active').order('sort_order'),
    ]);
    setEvents((eventData as EventRow[]) ?? []);
    setCoaches((coachData as CoachRow[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.starts_at) return;
    await supabase.from('events').insert({ ...newEvent, published: true });
    setNewEvent({ title: '', description: '', starts_at: '' });
    await load();
  };

  const togglePublished = async (id: string, published: boolean) => {
    await supabase.from('events').update({ published: !published }).eq('id', id);
    await load();
  };

  const addCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoach.name || !newCoach.specialty) return;
    await supabase.from('coaches').insert(newCoach);
    setNewCoach({ name: '', specialty: '' });
    await load();
  };

  const toggleCoachActive = async (id: string, active: boolean) => {
    await supabase.from('coaches').update({ active: !active }).eq('id', id);
    await load();
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl mb-2">Content Manager</h1>
        <p className="text-sm text-efn-black/60">Events and coaches — same source the public site and schedule read from.</p>
      </div>

      <section>
        <h2 className="font-semibold mb-4">Events</h2>
        <form onSubmit={addEvent} className="flex flex-wrap gap-3 mb-6">
          <input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent((v) => ({ ...v, title: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-1 min-w-[160px]" />
          <input placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent((v) => ({ ...v, description: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-1 min-w-[160px]" />
          <input type="datetime-local" value={newEvent.starts_at} onChange={(e) => setNewEvent((v) => ({ ...v, starts_at: e.target.value }))} className="border border-efn-gray px-3 py-2" />
          <button type="submit" className="btn-solid">Add Event</button>
        </form>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between bg-efn-offwhite px-4 py-3 text-sm">
              <span>{e.title} — {new Date(e.starts_at).toLocaleString()}</span>
              <button onClick={() => togglePublished(e.id, e.published)} className="text-efn-green hover:underline">
                {e.published ? 'Unpublish' : 'Publish'}
              </button>
            </li>
          ))}
          {events.length === 0 && <p className="text-sm text-efn-black/50">No events yet.</p>}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Coaches</h2>
        <form onSubmit={addCoach} className="flex flex-wrap gap-3 mb-6">
          <input placeholder="Name" value={newCoach.name} onChange={(e) => setNewCoach((v) => ({ ...v, name: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-1 min-w-[160px]" />
          <input placeholder="Specialty" value={newCoach.specialty} onChange={(e) => setNewCoach((v) => ({ ...v, specialty: e.target.value }))} className="border border-efn-gray px-3 py-2 flex-1 min-w-[160px]" />
          <button type="submit" className="btn-solid">Add Coach</button>
        </form>
        <ul className="space-y-2">
          {coaches.map((c) => (
            <li key={c.id} className="flex items-center justify-between bg-efn-offwhite px-4 py-3 text-sm">
              <span>{c.name} — {c.specialty}</span>
              <button onClick={() => toggleCoachActive(c.id, c.active)} className="text-efn-green hover:underline">
                {c.active ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          ))}
          {coaches.length === 0 && <p className="text-sm text-efn-black/50">No coaches yet — none exist on the live site either (see docs/COMPARISON.md).</p>}
        </ul>
      </section>
    </div>
  );
}
