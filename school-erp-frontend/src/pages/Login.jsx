import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

// Shield icon
const ShieldIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const EyeOpen = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EyeClosed = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const MAX_ATTEMPTS = 5;

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const attemptsPercent = remainingAttempts !== null
    ? (remainingAttempts / MAX_ATTEMPTS) * 100
    : 100;

  const attemptsColor = remainingAttempts === null ? '' :
    remainingAttempts <= 1 ? 'bg-red-500' :
    remainingAttempts <= 2 ? 'bg-orange-500' :
    'bg-amber-400';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setError('');
    setAuthLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      setRemainingAttempts(null);

      if (res?.data?.success) {
        const { token, user } = res.data;
        login(token, user);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        // ✅ 5 attempts cross ho chuke — loginLimiter ka custom handler yahan fire hota hai
        const retryAfter = err.response.data?.retryAfter || (15 * 60);
        setLockoutTime(retryAfter);
        setRemainingAttempts(0);
        setError(err.response.data?.message || 'Too many attempts. Try again in 15 minutes.');
      } else {
        // ✅ FIX: ab header ki jagah seedha response BODY se remainingAttempts padha
        // (CORS custom-header-read issue se bachne ke liye — backend se hi bhej rahe hain)
        const remaining = err.response?.data?.remainingAttempts;
        if (remaining !== undefined && remaining !== null) setRemainingAttempts(remaining);
        setError(err.response?.data?.message || 'Incorrect email or password.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const isLocked = lockoutTime > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-fuchsia-50/30 flex items-center justify-center p-4">

      {/* Ambient soft glow blobs — light version */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/30 mb-4">
            <span className="text-white font-black text-lg">E</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">EduSuite</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">School Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-xl shadow-slate-200/60">

          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your credentials to continue</p>
          </div>

          {/* ── LOCKOUT BANNER ── */}
          {isLocked && (
            <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-rose-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-rose-700 text-xs font-bold mb-1">Account temporarily locked</p>
                  <p className="text-slate-500 text-xs">Too many failed attempts. Try again in</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-white border border-rose-200 rounded-lg px-3 py-1.5">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-rose-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-800 font-mono font-black text-sm">{formatTime(lockoutTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {error && !isLocked && (
            <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-rose-200 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              </div>
              <p className="text-rose-700 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* ── ATTEMPTS BAR ── */}
          {remainingAttempts !== null && !isLocked && remainingAttempts < MAX_ATTEMPTS && (
            <div className="mb-5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-medium">Login attempts remaining</span>
                <span className={`text-[11px] font-black ${remainingAttempts <= 1 ? 'text-rose-600' : remainingAttempts <= 2 ? 'text-orange-600' : 'text-amber-600'}`}>
                  {remainingAttempts} / {MAX_ATTEMPTS}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${attemptsColor}`}
                  style={{ width: `${attemptsPercent}%` }}
                />
              </div>
              {remainingAttempts === 1 && (
                <p className="text-rose-600 text-[10px] font-semibold">
                  ⚠️ One more failed attempt will lock your account for 15 minutes.
                </p>
              )}
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block">
                Email address
              </label>
              <input
                type="email"
                required
                disabled={isLocked}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@school.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium px-4 py-3 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLocked}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium px-4 py-3 pr-11 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  disabled={isLocked}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || isLocked}
              className="w-full mt-2 relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 disabled:cursor-not-allowed disabled:shadow-none group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative flex items-center justify-center gap-2">
                {authLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Verifying...
                  </>
                ) : isLocked ? (
                  <>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Locked · {formatTime(lockoutTime)}
                  </>
                ) : (
                  <>
                    <ShieldIcon />
                    Sign in
                  </>
                )}
              </span>
            </button>
          </form>

          {/* ── FOOTER ── */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <p className="text-slate-400 text-[11px]">Don't have an account?</p>
            <Link
              to="/register"
              className="text-purple-600 hover:text-purple-700 text-[11px] font-semibold transition-colors"
            >
              Register your school →
            </Link>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-5 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secured with JWT · bcrypt · Rate limiting
        </div>
      </div>
    </div>
  );
};

export default Login;