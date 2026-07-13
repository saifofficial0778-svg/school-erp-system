import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const FeesManagement = () => {
  const { user } = useAuth();
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLiveLedger = async () => {
    try {
      setLoading(true);
      const res = await API.get('/fees');
      if (res?.data?.success) {
        setFeeRecords(res.data.data);
      } else {
        console.error("Backend failed response token check!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Network interface drop or connection rejection:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchLiveLedger();
  }, [user?.schoolId]);

  const redirectToCollectionPage = (record) => {
    const params = new URLSearchParams({
      studentId: record.student_id,
      name: record.full_name,
      total: record.total_fee,
      paid: record.total_paid
    });
    window.location.href = `/fee-collection?${params.toString()}`;
  };

  const filteredRecords = feeRecords.filter(record => {
    const textStr = (record.full_name || '').toLowerCase();
    const admStr = (record.admission_number || '').toString().toLowerCase();
    const target = searchQuery.toLowerCase();
    return textStr.includes(target) || admStr.includes(target);
  });

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  // Ledger-wide stats
  const totalCollected = feeRecords.reduce((sum, r) => sum + (parseFloat(r.total_paid) || 0), 0);
  const totalDue = feeRecords.reduce((sum, r) => sum + (parseFloat(r.total_due) || 0), 0);
  const fullyPaidCount = feeRecords.filter(r => r.status === 'paid').length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/40 min-h-screen font-sans">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 p-8 shadow-xl">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-3">
            Accounts Desk Terminal
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Fee Collection Ledger</h1>
          <p className="text-sm text-emerald-200/80 mt-1.5">Manage student fees, tracking logs, and cash counters live.</p>
        </div>

        <div className="relative grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider">Collected</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">₹{totalCollected.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider">Outstanding</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">₹{totalDue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider">Fully Paid</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{fullyPaidCount}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search via Name or Admission Key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Main Datatable Wrapper */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-gray-400 font-black tracking-wider uppercase border-b border-gray-100">
              <th className="px-6 py-4">Student Identity Profile</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Cleared / Total Fees</th>
              <th className="px-6 py-4">Outstanding Balance</th>
              <th className="px-6 py-4 text-center">Operation Desk</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan="5" className="px-6 py-4">
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-gray-400 font-medium italic">
                  Bhai database me koi real record match nahi mila!
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, idx) => {
                const balance = parseFloat(record.total_due || 0);
                return (
                  <tr key={record.student_id || idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-[11px] shrink-0">
                          {getInitials(record.full_name)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{record.full_name}</p>
                          <p className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">Adm: #{record.admission_number || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold px-2.5 py-0.5 rounded-full uppercase text-[9px] ${record.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : record.status === 'partial' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                        }`}>{record.status}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      ₹{parseFloat(record.total_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} /
                      <span> ₹{parseFloat(record.total_fee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className={`px-6 py-4 font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => redirectToCollectionPage(record)}
                        disabled={balance <= 0 && record.status === 'paid'}
                        className={`text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${balance <= 0 && record.status === 'paid' ? 'bg-slate-300 pointer-events-none shadow-none' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                          }`}
                      >
                        {balance <= 0 && record.status === 'paid' ? "Settled ✓" : "Collect Fee"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FeesManagement;