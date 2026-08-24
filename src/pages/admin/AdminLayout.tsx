import { NavLink, Outlet } from 'react-router-dom';
import { useStaffAuth } from '../../lib/useStaffAuth';
import { AdminLogin } from './AdminLogin';
import { supabase } from '../../lib/supabase';

interface NavLinkDef {
  to: string;
  label: string;
  end?: boolean;
  ownerOnly?: boolean;
}

const navGroups: { label: string; links: NavLinkDef[] }[] = [
  {
    label: 'Overview',
    links: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    label: 'Schedule & Content',
    links: [
      { to: '/admin/schedule', label: 'Schedule Manager' },
      { to: '/admin/content', label: 'Content Manager' },
      { to: '/admin/bookings', label: 'Bookings' },
    ],
  },
  {
    label: 'Finance & Reports',
    links: [
      { to: '/admin/sales', label: 'Sales' },
      { to: '/admin/revenue', label: 'Revenue' },
      { to: '/admin/pricing', label: 'Pricing' },
    ],
  },
  {
    label: 'Customers & Marketing',
    links: [
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/marketing', label: 'Marketing' },
      { to: '/admin/support', label: 'Support' },
    ],
  },
  {
    label: 'Settings',
    links: [{ to: '/admin/audit', label: 'Audit Log', ownerOnly: true }],
  },
];

export function AdminLayout() {
  const { user, profile, loading, refresh } = useStaffAuth();

  if (loading) return <div className="py-16 text-center">Loading…</div>;
  if (!user || !profile) return <AdminLogin />;

  return (
    <div className="grid md:grid-cols-[220px_1fr] min-h-[70vh]">
      <aside className="bg-efn-black text-efn-white p-6 overflow-y-auto">
        <p className="font-heading font-bold text-lg mb-1">Encore Admin</p>
        <p className="text-xs text-efn-white/60 mb-8">{profile.name ?? user.email} · {profile.role}</p>
        <nav className="flex flex-col gap-6 text-sm">
          {navGroups.map((group) => {
            const links = group.links.filter((l) => !l.ownerOnly || profile.role === 'owner');
            if (links.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="text-[10px] uppercase tracking-wide text-efn-white/40 mb-2 px-3">{group.label}</p>
                <div className="flex flex-col gap-1">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.end}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded ${isActive ? 'bg-efn-green text-efn-white' : 'hover:bg-efn-white/10'}`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <button
          onClick={() => supabase.auth.signOut().then(refresh)}
          className="mt-8 text-xs text-efn-white/60 hover:text-efn-white"
        >
          Sign out
        </button>
      </aside>
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}
