import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useMemberAuth } from '../../lib/useMemberAuth';

interface CoachClass {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  class_name: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Real account page — the thing the old /login page never had behind it.
// Shows who you are, what account type you have, your subscription (if
// staff have recorded one), and — for coach accounts — the classes
// assigned to you.
export function Account() {
  const { user, member } = useMemberAuth();
  const [myClasses, setMyClasses] = useState<CoachClass[]>([]);

  useEffect(() => {
    if (member?.role === 'coach' && member.coach_id) {
      supabase
        .from('class_slots')
        .select('id, day_of_week, start_time, end_time, class_name')
        .eq('coach_id', member.coach_id)
        .eq('active', true)
        .order('day_of_week')
        .order('start_time')
        .then(({ data }) => setMyClasses((data as CoachClass[]) ?? []));
    }
  }, [member?.role, member?.coach_id]);

  if (!member || !user) return null;

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl mb-6">My Account</h1>
        <div className="bg-efn-offwhite p-6 space-y-3">
          <Row label="Name" value={member.name} />
          <Row label="Phone" value={member.phone} />
          <Row label="Email" value={user.email ?? '—'} />
          <Row label="Account Type" value={member.role === 'coach' ? 'Coach' : 'Member'} />
          <Row label="Loyalty Points" value={String(member.loyalty_points)} />
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-4">Subscription</h2>
        {member.plan ? (
          <div className="bg-efn-offwhite p-6">
            <p className="text-lg font-semibold">{member.plan.name}</p>
            <p className="text-efn-green">KES {member.plan.price_kes.toLocaleString('en-KE')}</p>
          </div>
        ) : (
          <div className="bg-efn-offwhite p-6">
            <p className="text-sm text-efn-black/60 mb-4">
              No plan on file yet. Staff record your active membership plan once you sign up in person or via WhatsApp —
              there's no automated payment link yet.
            </p>
            <Link to="/fitness-studio#membership" className="btn-outline-dark inline-block text-sm">View Membership Plans</Link>
          </div>
        )}
      </div>

      {member.role === 'coach' && (
        <div>
          <h2 className="text-xl mb-4">My Classes</h2>
          {myClasses.length === 0 ? (
            <p className="text-sm text-efn-black/60">No classes currently assigned to you.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {myClasses.map((c) => (
                <div key={c.id} className="bg-efn-offwhite p-5">
                  <p className="text-xs uppercase tracking-wide text-efn-green font-semibold mb-1">{DAYS[c.day_of_week]}</p>
                  <p className="text-lg font-semibold mb-1">{c.class_name}</p>
                  <p className="text-sm text-efn-black/60">{c.start_time}–{c.end_time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-efn-black/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
