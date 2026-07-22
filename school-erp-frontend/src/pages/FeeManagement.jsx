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

  const statusLabel = { paid: 'Paid', partial: 'Partial', pending: 'Pending' };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Formal top bar */}
      <div className="bg-white border-b border-slate-300 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Accounts / Fee Ledger</p>
          <h1 className="text-lg font-bold text-slate-900">Fee Collection Ledger</h1>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>As on</p>
          <p className="font-semibold text-slate-700">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-5">

        {/* Summary strip — bordered table cells, not glass cards */}
        <div className="grid grid-cols-3 border border-slate-300 bg-white divide-x divide-slate-300">
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Collected</p>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Outstanding</p>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">₹{totalDue.toLocaleString('en-IN')}</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fully Settled Accounts</p>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">{fullyPaidCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-300">
          <input
            type="text"
            placeholder="Search via Name or Admission Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm px-4 py-3 focus:outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Ledger table */}
        <div className="bg-white border border-slate-300">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-500 font-semibold uppercase text-[11px] tracking-wide border-b border-slate-300">
                <th className="px-5 py-3 border-r border-slate-200">Student</th>
                <th className="px-5 py-3 border-r border-slate-200">Status</th>
                <th className="px-5 py-3 border-r border-slate-200">Cleared / Total</th>
                <th className="px-5 py-3 border-r border-slate-200">Balance Due</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="px-5 py-4">
                      <div className="h-4 w-full bg-slate-100 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center text-slate-400 italic">
                    No matching records found in the ledger.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, idx) => {
                  const balance = parseFloat(record.total_due || 0);
                  const statusKey = (record.status || 'pending').toLowerCase();
                  return (
                    <tr key={record.student_id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 border-r border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-[11px] shrink-0">
                            {getInitials(record.full_name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{record.full_name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">Adm: #{record.admission_number || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 border-r border-slate-100">
                        <span className={`inline-block border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          statusKey === 'paid' ? 'border-slate-800 text-slate-800' :
                          statusKey === 'partial' ? 'border-slate-400 text-slate-600' :
                          'border-rose-600 text-rose-600'
                        }`}>
                          {statusLabel[statusKey] || record.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 border-r border-slate-100 font-mono">
                        ₹{parseFloat(record.total_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        <span className="text-slate-400"> / ₹{parseFloat(record.total_fee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td className={`px-5 py-3.5 border-r border-slate-100 font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => redirectToCollectionPage(record)}
                          disabled={balance <= 0 && statusKey === 'paid'}
                          className={`text-xs font-semibold px-4 py-1.5 border transition-all ${
                            balance <= 0 && statusKey === 'paid'
                              ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                              : 'border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {balance <= 0 && statusKey === 'paid' ? "Settled" : "Collect"}
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

    </div>
  );
};

export default FeesManagement;