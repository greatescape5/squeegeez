'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { browserSupabase } from '@/lib/supabaseBrowser';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  // If already logged in, skip straight to the dashboard.
  useEffect(() => {
    browserSupabase().auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin/dashboard');
      else setChecking(false);
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await browserSupabase().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/admin/dashboard');
    }
  }

  if (checking) {
    return <section className="section"><div className="container center">Loading…</div></section>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="form-wrap" style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: '1.8rem' }}>Admin Login</h1>
          <p className="form-note" style={{ marginBottom: 24 }}>
            Sign in to manage gallery projects and view leads.
          </p>
          <form onSubmit={handleLogin}>
            {error && <div className="alert err">{error}</div>}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
