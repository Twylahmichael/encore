import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface StaffProfile {
  id: string;
  role: 'owner' | 'staff';
  name: string | null;
}

export function useStaffAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // `loading` covers only the very first resolution — see useMemberAuth.ts
  // for why it's deliberately not reset to true on later refreshes (avoids
  // an unmount-triggered reset of AdminLogin's local tab state on every
  // background auth event).
  const refresh = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      let { data } = await supabase.from('staff_profiles').select('id, role, name').eq('id', user.id).maybeSingle();

      // Self-heal: a user can exist (post-confirmation sign-in) with no
      // staff_profiles row yet if signup happened while email confirmation
      // was pending — see claim_first_owner in 0006. Safe to call on every
      // refresh: it only ever inserts when staff_profiles is empty, and
      // only for the caller's own id, so it's a no-op once an owner exists.
      if (!data) {
        const name = (user.user_metadata as { name?: string } | null)?.name ?? user.email ?? 'Owner';
        const { data: claimed } = await supabase.rpc('claim_first_owner', { owner_name: name });
        if (claimed) {
          ({ data } = await supabase.from('staff_profiles').select('id, role, name').eq('id', user.id).maybeSingle());
        }
      }

      setProfile(data as StaffProfile | null);
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, profile, loading, refresh };
}
