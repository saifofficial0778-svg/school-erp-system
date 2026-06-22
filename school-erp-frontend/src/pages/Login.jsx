import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    try {
      // 🎯 API trigger for authentication connection
      const res = await API.post('/auth/login', { email, password });
      
      if (res?.data?.success) {
        const { token, user } = res.data;
        // AuthContext and localStorage updated instantly!
        login(token, user);
      } else {
        setError('Bhai, parameters validation fail ho gayi!');
      }
    } catch (err) {
      console.error("Authentication Error:", err.message);
      setError(err.response?.data?.message || "Invalid credentials! Check username/password, bhai.");
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

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Corporate Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
              className="w-full bg-slate-50/50 border border-slate-200 text-xs font-semibold text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Secret Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50/50 border border-slate-200 text-xs font-semibold text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-[0_4px_12px_-2px_rgba(79,70,229,0.3)] tracking-wide uppercase mt-2"
          >
            {authLoading ? "Verifying Token Matrix..." : "Authorize Roster Access 🔒"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;