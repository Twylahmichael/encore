import { useState } from 'react';
import { supabase } from '../lib/supabase';

// Sampled from efn.co.ke's WooCommerce "My Account" page: Login / Sign Up
// tabs, Username or Email + Password + Remember Me + Forgot Password on the
// login side, Email + Password + privacy-policy notice on the register side.
export function Login() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('username')),
      password: String(form.get('password')),
    });
    if (error) setError(error.message);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(form.get('email')),
      password: String(form.get('password')),
    });
    if (error) setError(error.message);
  };

  return (
    <section className="py-16">
      <div className="max-w-md mx-auto px-6">
        <div className="flex border-b border-efn-gray/30 mb-8">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 font-semibold ${tab === 'login' ? 'border-b-2 border-efn-green text-efn-green' : 'text-efn-black/50'}`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 font-semibold ${tab === 'signup' ? 'border-b-2 border-efn-green text-efn-green' : 'text-efn-black/50'}`}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="block text-sm mb-1">Username or Email Address</span>
              <input name="username" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Password</span>
              <input type="password" name="password" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
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
              <input type="email" name="email" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Password</span>
              <input type="password" name="password" required className="w-full border border-efn-gray px-4 py-3" />
            </label>
            <p className="text-xs text-efn-black/60">
              Your personal data will be used to support your experience throughout this website,
              to manage access to your account, and for other purposes described in our privacy policy.
            </p>
            <button type="submit" className="btn-solid w-full text-center">Register</button>
          </form>
        )}
      </div>
    </section>
  );
}
