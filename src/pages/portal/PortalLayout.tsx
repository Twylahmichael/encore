import { NavLink, Outlet } from 'react-router-dom';
import { useMemberAuth } from '../../lib/useMemberAuth';
import { PortalLogin } from './PortalLogin';
import { supabase } from '../../lib/supabase';

export function PortalLayout() {
  const { user, member, loading, refresh } = useMemberAuth();

  if (loading) return <div className="py-16 text-center">Loading…</div>;
  if (!user || !member) return <PortalLogin />;

  return (
    <div>
      <div className="bg-efn-offwhite border-b border-efn-gray/20">
        <div className="max-w-site mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Hi, {member.name.split(' ')[0]}</p>
            <p className="text-xs text-efn-black/60">{member.phone}</p>
          </div>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/my-encore" end className={({ isActive }) => isActive ? 'text-efn-green font-semibold' : ''}>My Calendar</NavLink>
            <NavLink to="/my-encore/book" className={({ isActive }) => isActive ? 'text-efn-green font-semibold' : ''}>Book a Class</NavLink>
            <NavLink to="/my-encore/account" className={({ isActive }) => isActive ? 'text-efn-green font-semibold' : ''}>Account</NavLink>
            <button onClick={() => supabase.auth.signOut().then(refresh)} className="text-efn-black/60 hover:text-efn-black">Sign out</button>
          </nav>
        </div>
      </div>
      <div className="max-w-site mx-auto px-6 py-10">
        <Outlet />
      </div>
    </div>
  );
}
