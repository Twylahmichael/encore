import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useMemberAuth } from '../../lib/useMemberAuth';
import { PasswordField } from '../../components/PasswordField';

// Member signup/login — Phase 2 of the Encore proposal ("Member logins +
// personal calendar"). Identity is phone-first in spirit (phone is the
// field that matters for WhatsApp/attendance), but auth itself runs on
// Supabase Auth's email+password since phone-OTP needs an SMS provider
// (Twilio etc.) that isn't configured — see docs/COMPARISON.md.
//
// Note: the `members` row is NOT created right after signUp() — if email
// confirmation is required (the Supabase default), there's no session yet
// at that point. name/phone are captured into auth user_metadata at
// signup time instead, and the row is created on the next successful
// sign-in via useMemberAuth's self-heal (see supabase/migrations/
// 0006_fix_signup_profile_creation.sql).
export function PortalLogin() {
  const { refresh } = useMemberAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    if (error) setError(error.message);
    else await refresh();
    setBusy(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name'));
    const phone = String(form.get('phone'));
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    if (data.session) {
      // Confirmation not required — we're already signed in; create the
      // profile row now via the same self-heal path a later login would use.
      await refresh();
    } else {
      setInfo('Account created — check your email to confirm it, then sign in.');
      setMode('login');
    }
    setBusy(false);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-8 text-center">My Encore</h1>

        <div className="flex border-b border-efn-gray/30 mb-6 text-sm">
          <button onClick={() => { setMode('signup'); setError(''); setInfo(''); }} className={`flex-1 py-2 ${mode === 'signup' ? 'border-b-2 border-efn-green text-efn-green font-semibold' : 'text-efn-black/50'}`}>
            Create account
          </button>
          <button onClick={() => { setMode('login'); setError(''); setInfo(''); }} className={`flex-1 py-2 ${mode === 'login' ? 'border-b-2 border-efn-green text-efn-green font-semibold' : 'text-efn-black/50'}`}>
            Sign in
          </button>
        </div>

        {info && <p className="text-efn-green text-sm mb-4">{info}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {mode === 'signup' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Full Name</span>
              <input name="name" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Phone Number</span>
              <input type="tel" name="phone" required placeholder="07XX XXX XXX" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required autoComplete="email" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <PasswordField name="password" label="Password" required minLength={6} autoComplete="new-password" />
            <button type="submit" disabled={busy} className="btn-solid w-full">{busy ? '…' : 'Create Account'}</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required autoComplete="email" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <PasswordField name="password" label="Password" required autoComplete="current-password" />
            <button type="submit" disabled={busy} className="btn-solid w-full">{busy ? '…' : 'Sign In'}</button>
          </form>
        )}
      </div>
    </section>
  );
}
