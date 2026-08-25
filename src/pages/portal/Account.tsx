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

interface OrderRow {
  id: string;
  created_at: string;
  status: string;
  subtotal_kes: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const STATUS_LABEL: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

type Tab = 'dashboard' | 'orders' | 'details' | 'classes';

// Real account page — the thing the old /login page never had behind it.
// Laid out as a sidebar + content dashboard (per the client's reference
// screenshot of the live WooCommerce "My Account" page), but every tab
// here is backed by real data — no Downloads/Addresses tabs, since this
// app has no digital downloads and doesn't collect a separate shipping
// address on its own (checkout collects one per-order, not per-account).
export function Account() {
  const { user, member, refresh } = useMemberAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [myClasses, setMyClasses] = useState<CoachClass[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

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

  // Orders aren't tied to a member_id at checkout (guest checkout, no
  // account required — matches the live site) — matched by email instead,
  // so this only shows orders placed with the same email as this login.
  // See supabase/migrations/0011_member_reads_own_orders.sql.
  useEffect(() => {
    if (!user?.email) return;
    supabase
      .from('orders')
      .select('id, created_at, status, subtotal_kes')
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderRow[]) ?? []);
        setOrdersLoaded(true);
      });
  }, [user?.email]);

  if (!member || !user) return null;

  const firstName = member.name.split(' ')[0];
  const signOut = () => supabase.auth.signOut().then(refresh);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'details', label: 'Account Details' },
    ...(member.role === 'coach' ? [{ id: 'classes' as Tab, label: 'My Classes' }] : []),
  ];

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-10">
      <aside>
        <nav className="flex flex-col text-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left px-4 py-3 transition-colors ${
                tab === t.id ? 'bg-efn-green text-efn-white font-semibold' : 'bg-efn-offwhite hover:bg-efn-gray/20'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button onClick={signOut} className="text-left px-4 py-3 text-efn-black/60 hover:text-efn-black">
            Log out
          </button>
        </nav>
      </aside>

      <div>
        {tab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl mb-4">My Account</h1>
              <p className="text-sm text-efn-black/70">
                Hello, <strong>{firstName}</strong> (not you?{' '}
                <button onClick={signOut} className="text-efn-green underline">Log out</button>)
              </p>
              <p className="text-sm text-efn-black/60 mt-2">
                From your account dashboard you can view your{' '}
                <button onClick={() => setTab('orders')} className="text-efn-green underline">recent orders</button>{' '}
                and manage your{' '}
                <button onClick={() => setTab('details')} className="text-efn-green underline">account details</button>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Subscription</h2>
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
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h1 className="text-2xl mb-6">Orders</h1>
            {!ordersLoaded ? (
              <p className="text-sm text-efn-black/60">Loading…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-efn-black/60">
                No orders yet. Orders placed at checkout with this account's email ({user.email}) will show up here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="text-left text-efn-black/60 border-b border-efn-gray/30">
                      <th className="py-2 pr-4">Order</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-efn-gray/10">
                        <td className="py-2 pr-4 font-mono text-xs">{o.id.slice(0, 8)}</td>
                        <td className="py-2 pr-4">{new Date(o.created_at).toLocaleDateString('en-KE')}</td>
                        <td className="py-2 pr-4">{STATUS_LABEL[o.status] ?? o.status}</td>
                        <td className="py-2 pr-4">KShs {Number(o.subtotal_kes).toLocaleString('en-KE')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'details' && (
          <div>
            <h1 className="text-2xl mb-6">Account Details</h1>
            <div className="bg-efn-offwhite p-6 space-y-3 max-w-md">
              <Row label="Name" value={member.name} />
              <Row label="Phone" value={member.phone} />
              <Row label="Email" value={user.email ?? '—'} />
              <Row label="Account Type" value={member.role === 'coach' ? 'Coach' : 'Member'} />
              <Row label="Loyalty Points" value={String(member.loyalty_points)} />
            </div>
          </div>
        )}

        {tab === 'classes' && member.role === 'coach' && (
          <div>
            <h1 className="text-2xl mb-6">My Classes</h1>
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
