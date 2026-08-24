import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PasswordField } from '../components/PasswordField';

// Sampled from efn.co.ke's WooCommerce "My Account" page: Login / Sign Up
// tabs, Username or Email + Password + Remember Me + Forgot Password on the
// login side, Email + Password + privacy-policy notice on the register side.
export function Login() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('username')),
      password: String(form.get('password')),
    });
    if (error) setError(error.message);
    else setInfo('Signed in.');
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const form = new FormData(e.currentTarget);
    const { data, error } = await supabase.auth.signUp({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    if (error) {
      setError(error.message);
    } else if (data.session) {
      setInfo('Account created and signed in.');
    } else {
      setInfo('Account created — check your email to confirm it, then log in.');
      setTab('login');
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-md mx-auto px-6">
        <div className="flex border-b border-efn-gray/30 mb-8">
          <button
            onClick={() => { setTab('login'); setError(''); setInfo(''); }}
            className={`flex-1 py-3 font-semibold ${tab === 'login' ? 'border-b-2 border-efn-green text-efn-green' : 'text-efn-black/50'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('signup'); setError(''); setInfo(''); }}
            className={`flex-1 py-3 font-semibold ${tab === 'signup' ? 'border-b-2 border-efn-green text-efn-green' : 'text-efn-black/50'}`}
          >
            Sign Up
          </button>
        </div>

        {info && <p className="text-efn-green text-sm mb-4">{info}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Username or Email Address</span>
              <input name="username" required autoComplete="username" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <PasswordField name="password" label="Password" required autoComplete="current-password" />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="remember" /> Remember Me
              </label>
              <a href="#" className="hover:text-efn-green">Forgot Password?</a>
            </div>
            <button type="submit" className="btn-solid w-full text-center">Log In</button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Email</span>
              <input type="email" name="email" required autoComplete="email" className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <PasswordField name="password" label="Password" required autoComplete="new-password" />
            <p className="text-xs text-efn-black/60">
              Your personal data will be used to support your experience throughout this website,
              to manage access to your account, and for other purposes described in our{' '}
              <Link to="/privacy-policy" className="underline hover:text-efn-green">privacy policy</Link>.
            </p>
            <button type="submit" className="btn-solid w-full text-center">Register</button>
          </form>
        )}
      </div>
    </section>
  );
}
