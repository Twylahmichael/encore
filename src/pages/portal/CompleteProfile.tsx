import { useState } from 'react';
import { supabase } from '../../lib/supabase';

// Shown when someone is signed in (real Supabase Auth session) but has no
// `members` row yet — e.g. an owner/staff account created via the admin
// bootstrap flow, which never asked for name/phone, so useMemberAuth's
// normal self-heal (which relies on that metadata being set at signup) has
// nothing to work with. Previously this silently looped back to the sign-in
// form with zero explanation — "click Sign In, nothing happens" — since
// PortalLayout's `!user || !member` check doesn't distinguish "not signed
// in" from "signed in, no profile yet". This form calls the same
// ensure_member_profile RPC directly with user-entered values instead.
export function CompleteProfile({ refresh }: { refresh: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const { error: rpcError } = await supabase.rpc('ensure_member_profile', {
      member_name: String(form.get('name')),
      member_phone: String(form.get('phone')),
    });
    if (rpcError) {
      setError(rpcError.message);
      setBusy(false);
      return;
    }
    await refresh();
    setBusy(false);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-2 text-center">One more step</h1>
        <p className="text-sm text-efn-black/60 mb-8 text-center">
          You're signed in, but this account doesn't have a member profile yet — needed for
          your calendar and bookings. Add your name and phone to finish setting it up.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm mb-1">Full Name</span>
            <input name="name" required className="w-full border border-efn-gray px-4 py-3" />
          </label>
          <label className="block">
            <span className="block text-sm mb-1">Phone Number</span>
            <input type="tel" name="phone" required placeholder="07XX XXX XXX" className="w-full border border-efn-gray px-4 py-3" />
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={busy} className="btn-solid w-full">{busy ? '…' : 'Continue'}</button>
        </form>
        <button
          onClick={() => supabase.auth.signOut().then(refresh)}
          className="w-full text-center text-xs text-efn-black/50 hover:text-efn-black mt-6"
        >
          Not you? Sign out
        </button>
      </div>
    </section>
  );
}
