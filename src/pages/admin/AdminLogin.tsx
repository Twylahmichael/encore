import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useStaffAuth } from '../../lib/useStaffAuth';

// Staff/owner sign-in. There's no open signup: a brand-new Supabase project
// has zero rows in staff_profiles, so the FIRST person to sign up here and
// hit "Claim Owner Account" becomes owner (allowed once by the "bootstrap
// first owner" RLS policy in 0002). Every account after that must be added
// by an existing owner — this UI doesn't offer general staff self-signup.
export function AdminLogin() {
  const { refresh } = useStaffAuth();
  const [mode, setMode] = useState<'login' | 'bootstrap'>('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError('');
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
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const name = String(form.get('name'));

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? 'Could not create account.');
      setBusy(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('staff_profiles')
      .insert({ id: data.user.id, role: 'owner', name });

    if (profileError) {
      setError(
        'Account created, but an owner already exists — ask them to add you as staff. ' +
        `(${profileError.message})`,
      );
      setBusy(false);
      return;
    }

    await refresh();
    setBusy(false);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl mb-8 text-center">Encore Admin</h1>

        <div className="flex border-b border-efn-gray/30 mb-6 text-sm">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 ${mode === 'login' ? 'border-b-2 border-efn-green text-efn-green font-semibold' : 'text-efn-black/50'}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode('bootstrap')}
            className={`flex-1 py-2 ${mode === 'bootstrap' ? 'border-b-2 border-efn-green text-efn-green font-semibold' : 'text-efn-black/50'}`}
          >
            First-time setup
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Password</span>
              <input type="password" name="password" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
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
              <input type="email" name="email" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Password</span>
              <input type="password" name="password" required minLength={6} className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <button type="submit" disabled={busy} className="btn-solid w-full">{busy ? '…' : 'Claim Owner Account'}</button>
          </form>
        )}
      </div>
    </section>
  );
}
