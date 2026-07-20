import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 🎯 Rate Limit & Countdown States
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [lockoutTime, setLockoutTime] = useState(0);

  // ⏱️ Countdown Timer Logic
  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  // Seconds ko (MM:SS) format me convert karne ke liye helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return; // Prevent submission if locked out

    setError('');
    setAuthLoading(true);

    try {
      // 🎯 API trigger for authentication connection
      const res = await API.post('/auth/login', { email, password });

      // Clean rate limit warnings on success
      setRemainingAttempts(null);

      if (res?.data?.success) {
        const { token, user } = res.data;
        login(token, user);
      } else {
        setError('Bhai, parameters validation fail ho gayi!');
      }
    } catch (err) {
      console.error("Authentication Error:", err.message);

      // 🛑 1. Check for Rate Limit Exhausted (429 Status)
      if (err.response && err.response.status === 429) {
        const retryAfterSeconds = err.response.data?.retryAfter || 900; // fallback 15 mins
        setLockoutTime(retryAfterSeconds);
        setRemainingAttempts(0);
        setError(err.response.data?.message || "Too many attempts. Account locked temporarily!");
      } else {
        // ⚠️ 2. Normal Auth Error (Wrong Password, etc.)
        // Headers se remaining attempts padho
        const remaining = err.response?.headers?.['ratelimit-remaining'] || err.response?.headers?.['x-ratelimit-remaining'];
        
        if (remaining !== undefined) {
          setRemainingAttempts(Number(remaining));
        }

        setError(err.response?.data?.message || "Invalid credentials! Check username/password, bhai.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50/70 font-sans antialiased">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_24px_-4px_rgba(148,163,184,0.12)] space-y-6">
        
        {/* Top Logo and Header Layout */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">Secure Terminal</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">School ERP Gateway</h2>
          <p className="text-xs font-medium text-slate-400">Sign in to initialize executive session controls</p>
        </div>

        {/* Dynamic Error Message Box */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] font-bold text-rose-600 animate-shake">
            🚨 {error}
          </div>
        )}

        {/* ⚠️ Remaining Attempts Warning Badge */}
        {remainingAttempts !== null && remainingAttempts > 0 && lockoutTime === 0 && (
          <div className="p-2.5 bg-amber-50 border border-amber-200/60 rounded-xl text-[11px] font-bold text-amber-700 flex items-center justify-between">
            <span>⚠️ Security Warning:</span>
            <span className="bg-amber-100 px-2 py-0.5 rounded-md text-[10px] font-black">
              {remainingAttempts} {remainingAttempts === 1 ? 'Attempt' : 'Attempts'} Left
            </span>
          </div>
        )}

        {/* ⏳ Countdown Lockout Alert Box */}
        {lockoutTime > 0 && (
          <div className="p-3.5 bg-rose-100/70 border border-rose-200 rounded-xl text-[11px] font-bold text-rose-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black">
              <span>🛑 Account Locked</span>
            </div>
            <p className="text-[10px] font-semibold text-rose-600">Too many failed login attempts.</p>
            <div className="text-sm font-black text-rose-700 tracking-wider pt-1">
              Try again in: <span className="font-mono bg-white px-2 py-0.5 rounded border border-rose-200">{formatTime(lockoutTime)}</span>
            </div>
          </div>
        )}

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Corporate Email</label>
            <input 
              type="email" 
              required
              disabled={lockoutTime > 0}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
              className="w-full bg-slate-50/50 border border-slate-200 text-xs font-semibold text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Secret Password</label>
            <input 
              type="password" 
              required
              disabled={lockoutTime > 0}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border border-slate-200 text-xs font-semibold text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading || lockoutTime > 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-[0_4px_12px_-2px_rgba(79,70,229,0.3)] tracking-wide uppercase mt-2 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {authLoading 
              ? "Verifying Token Matrix..." 
              : lockoutTime > 0 
                ? `System Locked (${formatTime(lockoutTime)})` 
                : "Authorize Roster Access 🔒"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;