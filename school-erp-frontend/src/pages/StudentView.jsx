import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const StudentView = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id');
  const navigate = useNavigate();

  const [data, setData] = useState({ profile: null, feeSummary: null, feeLogs: [], attendance: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await API.get(`/students/${studentId}/profile-view`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard data load fail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchFullData();
  }, [studentId]);

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-purple-50/40 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 tracking-wide">Loading Student Dashboard Records...</p>
        </div>
      </div>
    );
  }

  const profile = data.profile;
  const totalFee = parseFloat(data.feeSummary?.total_fee) || 0;
  const totalPaid = parseFloat(data.feeSummary?.total_paid) || 0;
  const totalDue = parseFloat(data.feeSummary?.total_due) || 0;
  const collectionRate = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;

  const presentCount = data.attendance.filter(a => a.status === 'present').length;
  const attendanceRate = data.attendance.length > 0
    ? Math.round((presentCount / data.attendance.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-slate-50 to-purple-50/40 min-h-screen font-sans">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-fuchsia-900 p-8 shadow-xl">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <button
            onClick={() => navigate('/students')}
            className="self-start bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              {getInitials(profile?.full_name)}
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-purple-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                Student 360° Dashboard
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">{profile?.full_name || 'Student Profile'}</h1>
              <p className="text-xs text-purple-200/80 mt-0.5">Admission #{profile?.admission_number} · Roll No. {profile?.roll_number}</p>
            </div>
          </div>
        </div>

        {/* Inline quick stats */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-purple-200 uppercase tracking-wider">Fee Collected</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{collectionRate}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-purple-200 uppercase tracking-wider">Attendance Rate</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{attendanceRate}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 col-span-2 sm:col-span-1">
            <p className="text-[9px] font-bold text-purple-200 uppercase tracking-wider">Outstanding Due</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">₹{totalDue.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Personal Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
          <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">👤</span>
            Personal Details
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Full Name</span><strong className="text-slate-800">{profile?.full_name}</strong></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Email</span><span className="text-slate-700 truncate ml-2">{profile?.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Admission No</span><span className="font-mono text-slate-700">{profile?.admission_number}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Roll No</span><span className="font-mono text-slate-700">{profile?.roll_number}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">WhatsApp</span><span className="text-slate-700">{profile?.whats_app_number || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Guardian</span><span className="text-slate-700">{profile?.guardian_name || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Gender</span><span className="capitalize text-slate-700">{profile?.gender}</span></div>
          </div>
        </div>

        {/* Card 2: Fee Status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
          <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">💰</span>
            Fee Status
          </h2>

          {data.feeSummary ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-gray-400 font-medium">Total</p>
                  <p className="font-black text-gray-800 mt-0.5">₹{totalFee.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl">
                  <p className="text-emerald-500 font-medium">Paid</p>
                  <p className="font-black text-emerald-600 mt-0.5">₹{totalPaid.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl">
                  <p className="text-rose-400 font-medium">Due</p>
                  <p className="font-black text-rose-600 mt-0.5">₹{totalDue.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(collectionRate, 100)}%` }}
                ></div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 mb-4">No fee summary found.</p>
          )}

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment History</p>
          {data.feeLogs.length === 0 ? (
            <p className="text-xs text-gray-400">No payment history yet.</p>
          ) : (
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {data.feeLogs.map((log) => (
                <div key={log.id} className="border-b border-gray-50 pb-2 text-[11px] flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">TXN: {log.transaction_id || 'N/A'}</span>
                    <span className="font-bold text-emerald-600">₹{log.amount_paid}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span className="capitalize">{log.payment_mode}</span>
                    <span>{log.payment_date ? new Date(log.payment_date).toLocaleDateString('en-IN') : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Attendance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
          <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">📅</span>
            Attendance History
          </h2>

          {data.attendance.length === 0 ? (
            <p className="text-xs text-gray-400">No attendance logged yet.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-slate-700 font-mono">{attendanceRate}%</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {data.attendance.map((att, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                    <div>
                      <span className="text-gray-700 font-medium">{new Date(att.date).toLocaleDateString('en-IN')}</span>
                      {att.remarks && <p className="text-[10px] text-gray-400 italic">{att.remarks}</p>}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      att.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                      att.status === 'leave' ? 'bg-blue-50 text-blue-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {att.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentView;