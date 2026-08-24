import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PasswordField } from '../../components/PasswordField';

// Staff/owner sign-in. There's no open signup: the FIRST person to
// "First-time setup" and successfully sign in becomes owner. Every account
// after that must be added by an existing owner — this UI doesn't offer
// general staff self-signup.
//
// Note: profile-row creation does NOT happen right after signUp() — if
// email confirmation is required (the Supabase default), there's no
// session yet at that point, so it happens on the next successful sign-in
// instead, via useStaffAuth's self-heal (see supabase/migrations/
// 0006_fix_signup_profile_creation.sql for why).
// `refresh` comes from AdminLayout's own useStaffAuth() call — see the
// matching note in PortalLogin.tsx / useStaffAuth.ts for why this isn't a
// second independent hook instance.
export function AdminLogin({ refresh }: { refresh: () => Promise<void> }) {
  const [mode, setMode] = useState<'login' | 'bootstrap'>('login');
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

  const handleBootstrap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const name = String(form.get('name'));

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    if (data.session) {
      // Confirmation not required — we're already signed in; claim now.
      await refresh();
    } else {
      setInfo('Account created — check your email to confirm it, then sign in. You’ll become the owner automatically on your first successful sign-in.');
      setMode('login');
    }
    setBusy(false);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-8 text-center">Encore Admin</h1>

        <div className="flex border-b border-efn-gray/30 mb-6 text-sm">
          <button
            onClick={() => { setMode('login'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 ${mode === 'login' ? 'border-b-2 border-efn-green text-efn-green font-semibold' : 'text-efn-black/50'}`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode('bootstrap'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 ${mode === 'bootstrap' ? 'border-b-2 border-efn-green text-efn-green font-semibold' : 'text-efn-black/50'}`}
          >
            First-time setup
          </button>
        </div>

        {info && <p className="text-efn-green text-sm mb-4">{info}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required autoComplete="email" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <PasswordField name="password" label="Password" required autoComplete="current-password" />
            <button type="submit" disabled={busy} className="btn-solid w-full">{busy ? '…' : 'Sign In'}</button>
          </form>
        ) : (
          <form onSubmit={handleBootstrap} className="space-y-4">
            <p className="text-xs text-efn-black/60 mb-2">
              Only works once — for the very first owner account on a fresh Encore install.
            </p>
            <label className="block">
              <span className="block text-sm mb-1">Your Name</span>
              <input name="name" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required autoComplete="email" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <PasswordField name="password" label="Password" required minLength={6} autoComplete="new-password" />
            <button type="submit" disabled={busy} className="btn-solid w-full">{busy ? '…' : 'Claim Owner Account'}</button>
          </form>
        )}
      </div>
    </section>
  );
}
