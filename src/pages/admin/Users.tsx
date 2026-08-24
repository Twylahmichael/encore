import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useStaffAuth } from '../../lib/useStaffAuth';

interface MemberRow {
  id: string;
  name: string;
  phone: string;
  loyalty_points: number;
  created_at: string;
  active: boolean;
}
interface StaffRow {
  id: string;
  name: string | null;
  role: 'owner' | 'staff';
  created_at: string;
}

export function Users() {
  const { profile } = useStaffAuth();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [editingPoints, setEditingPoints] = useState<Record<string, string>>({});
  const [newStaff, setNewStaff] = useState({ email: '', name: '', role: 'staff' });
  const [addStaffError, setAddStaffError] = useState('');
  const [addingStaff, setAddingStaff] = useState(false);

  const load = async () => {
    const [{ data: memberData }, { data: staffData }] = await Promise.all([
      supabase.from('members').select('id, name, phone, loyalty_points, created_at, active').order('created_at', { ascending: false }),
      supabase.from('staff_profiles').select('id, name, role, created_at').order('created_at'),
    ]);
    setMembers((memberData as MemberRow[]) ?? []);
    setStaff((staffData as StaffRow[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const savePoints = async (id: string) => {
    const value = Number(editingPoints[id]);
    if (Number.isNaN(value)) return;
    await supabase.from('members').update({ loyalty_points: value }).eq('id', id);
    setEditingPoints((v) => { const next = { ...v }; delete next[id]; return next; });
    await load();
  };

  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingStaff(true);
    setAddStaffError('');
    const { error } = await supabase.rpc('add_staff_by_email', {
      target_email: newStaff.email.trim(),
      staff_role: newStaff.role,
      staff_name: newStaff.name.trim() || null,
    });
    if (error) {
      setAddStaffError(error.message);
    } else {
      setNewStaff({ email: '', name: '', role: 'staff' });
      await load();
    }
    setAddingStaff(false);
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl mb-2">Users</h1>
        <p className="text-sm text-efn-black/60">Members (portal accounts) and staff (admin accounts) in one place.</p>
      </div>

      <section>
        <h2 className="font-semibold mb-4">Members ({members.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-left text-efn-black/60 border-b border-efn-gray/30">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Joined</th>
                <th className="py-2 pr-4">Loyalty Points</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-efn-gray/10">
                  <td className="py-2 pr-4">{m.name}</td>
                  <td className="py-2 pr-4">{m.phone}</td>
                  <td className="py-2 pr-4">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editingPoints[m.id] ?? m.loyalty_points}
                        onChange={(e) => setEditingPoints((v) => ({ ...v, [m.id]: e.target.value }))}
                        className="w-20 border border-efn-gray px-2 py-1"
                      />
                      {editingPoints[m.id] !== undefined && (
                        <button onClick={() => savePoints(m.id)} className="text-efn-green hover:underline text-xs">Save</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-efn-black/50">No members yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Staff ({staff.length})</h2>
        <ul className="space-y-2 text-sm mb-6">
          {staff.map((s) => (
            <li key={s.id} className="flex justify-between bg-efn-offwhite px-4 py-3">
              <span>{s.name ?? '—'}</span>
              <span className="uppercase text-xs font-semibold text-efn-green-deep">{s.role}</span>
            </li>
          ))}
        </ul>

        {profile?.role === 'owner' && (
          <form onSubmit={addStaff} className="flex flex-wrap gap-3 items-start">
            <input
              type="email"
              placeholder="Their email (must already have an account)"
              required
              value={newStaff.email}
              onChange={(e) => setNewStaff((v) => ({ ...v, email: e.target.value }))}
              className="border border-efn-gray px-3 py-2 flex-1 min-w-[220px]"
            />
            <input
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) => setNewStaff((v) => ({ ...v, name: e.target.value }))}
              className="border border-efn-gray px-3 py-2 w-40"
            />
            <select
              value={newStaff.role}
              onChange={(e) => setNewStaff((v) => ({ ...v, role: e.target.value }))}
              className="border border-efn-gray px-3 py-2"
            >
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </select>
            <button type="submit" disabled={addingStaff} className="btn-solid">
              {addingStaff ? '…' : 'Add Staff'}
            </button>
            {addStaffError && <p className="text-red-600 text-sm w-full">{addStaffError}</p>}
          </form>
        )}
        <p className="text-xs text-efn-black/50 mt-3">
          They need an existing account first (e.g. sign up via My Encore or the shop login) — this looks
          up their account by email and grants staff/owner access, it doesn't create a new login.
        </p>
      </section>
    </div>
  );
}
