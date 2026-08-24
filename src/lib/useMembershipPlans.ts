import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { membershipPlans as staticPlans, type MembershipPlan } from '../data/membershipPlans';

// Live-with-fallback, same pattern as useLiveSchedule: membership_plans in
// Supabase is now the editable source of truth (admin Pricing page), the
// static file stays as the verbatim-sampled record + resilience fallback.
export function useMembershipPlans(): { plans: MembershipPlan[]; loading: boolean } {
  const [plans, setPlans] = useState<MembershipPlan[]>(staticPlans);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('membership_plans')
      .select('id, name, price_kes')
      .eq('active', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) {
          setLoading(false);
          return;
        }
        setPlans(data.map((p) => ({ id: p.id, name: p.name, priceKes: Number(p.price_kes) })));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { plans, loading };
}
