import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface MemberProfile {
  id: string;
  phone: string;
  name: string;
}

export function useMemberAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      let { data } = await supabase.from('members').select('id, phone, name').eq('id', user.id).maybeSingle();

      // Self-heal: a user can exist (post-confirmation sign-in) with no
      // members row yet, if signup happened while email confirmation was
      // pending — see ensure_member_profile in 0006. name/phone were
      // captured at signup time into auth user_metadata for exactly this.
      if (!data) {
        const meta = user.user_metadata as { name?: string; phone?: string } | null;
        if (meta?.name && meta?.phone) {
          await supabase.rpc('ensure_member_profile', { member_name: meta.name, member_phone: meta.phone });
          ({ data } = await supabase.from('members').select('id, phone, name').eq('id', user.id).maybeSingle());
        }
      }

      setMember(data as MemberProfile | null);
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
