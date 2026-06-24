import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext'; 

const FeesManagement = () => {
    const { user } = useAuth(); 
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 

  // 🔄 Live Database records pull lifecycle handler
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
    if (user?.schoolId) fetchLiveLedger(); // ✅ user load hone ka wait
  }, [user?.schoolId]); 

  // Safe Dynamic Redirection Parser
  const redirectToCollectionPage = (record) => {
    const params = new URLSearchParams({
      studentId: record.student_id,
      name: record.full_name,
      total: record.total_bill_amount,
      paid: record.amount_paid
    });
    window.location.href = `/fee-collection?${params.toString()}`;
  };

  // Live Query filter engine matching names or admission numbers
  const filteredRecords = feeRecords.filter(record => {
    const textStr = (record.full_name || '').toLowerCase();
    const admStr = (record.admission_number || '').toString().toLowerCase();
    const target = searchQuery.toLowerCase();
    return textStr.includes(target) || admStr.includes(target);
  });

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen font-sans">
      
      {/* Upper Context Branding bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Accounts Desk Terminal</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Manage student fees, tracking logs, and cash counters live.</p>
        </div>
        
        {/* Search Matrix */}
        <div className="w-full sm:w-72">
          <input 
            type="text"
            placeholder="Search via Name or Admission Key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-purple-600 font-medium transition-all text-slate-700 shadow-inner"
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
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                  Bhai backend se live rows fetch ho rhi hain, thoda hold karo... ⏳
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                  Bhai database me koi real record match nahi mila!
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, idx) => {
                const balance = parseFloat(record.total_bill_amount || 0) - parseFloat(record.amount_paid || 0);
                return (
                  <tr key={record.student_id || idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div>{record.full_name}</div>
                      <div className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">Adm: #{record.admission_number || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold px-2.5 py-0.5 rounded-full uppercase text-[9px] ${
                        record.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : record.status === 'partially_paid' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>{record.status}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      ₹{parseFloat(record.amount_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })} / 
                      <span className="text-gray-400"> ₹{parseFloat(record.total_bill_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className={`px-6 py-4 font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button 
                        onClick={() => redirectToCollectionPage(record)}
                        disabled={balance <= 0 && record.status === 'paid'}
                        className={`text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${
                          balance <= 0 && record.status === 'paid' ? 'bg-slate-300 pointer-events-none shadow-none' : 'bg-purple-600 hover:bg-purple-700'
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