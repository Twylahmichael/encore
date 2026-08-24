import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface MemberProfile {
  id: string;
  phone: string;
  name: string;
  role: 'member' | 'coach';
  coach_id: string | null;
  current_plan_id: string | null;
  loyalty_points: number;
  coach: { name: string; specialty: string } | null;
  plan: { name: string; price_kes: number } | null;
}

const SELECT = 'id, phone, name, role, coach_id, current_plan_id, loyalty_points, coach:coach_id(name, specialty), plan:current_plan_id(name, price_kes)';

export function useMemberAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      let { data } = await supabase.from('members').select(SELECT).eq('id', user.id).maybeSingle();

      // Self-heal: a user can exist (post-confirmation sign-in) with no
      // members row yet, if signup happened while email confirmation was
      // pending — see ensure_member_profile in 0006. name/phone were
      // captured at signup time into auth user_metadata for exactly this.
      if (!data) {
        const meta = user.user_metadata as { name?: string; phone?: string } | null;
        if (meta?.name && meta?.phone) {
          await supabase.rpc('ensure_member_profile', { member_name: meta.name, member_phone: meta.phone });
          ({ data } = await supabase.from('members').select(SELECT).eq('id', user.id).maybeSingle());
        }
      }

      setMember(data as unknown as MemberProfile | null);
    } else {
      setMember(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, member, loading, refresh };
}
