import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AttendanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolId] = useState('1');

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);
      const res = await API.get('/attendance/report');
      if (res?.data?.success) {
        setReportData(res.data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch analytical report data:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceReport();
  }, [schoolId]);

  // Executive summary counters computed live
  const totalTracked = reportData.length;
  const shortageCount = reportData.filter(s => {
    const total = s.total_classes || 0;
    const attended = s.attended_classes || 0;
    const pct = total > 0 ? (attended / total) * 100 : 0;
    return pct < 75;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[11px] font-bold text-slate-500 tracking-wide">Compiling academic registry matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 bg-slate-50/60 min-h-screen font-sans antialiased selection:bg-indigo-100">
      
      {/* 👑 PREMIUM CAPTION ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-full">Analytics Intelligence</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">Monthly Attendance Insights</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Analyze student consistency and automatically flag low attendance defaulters live</p>
        </div>
        
        {/* Quick Insights Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl px-4 py-2 text-left">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Audited</p>
            <p className="text-sm font-black text-slate-800 font-mono mt-0.5">{totalTracked} Students</p>
          </div>
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl px-4 py-2 text-left">
            <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Attendance Alerts</p>
            <p className="text-sm font-black text-rose-600 font-mono mt-0.5">{shortageCount} Shortage</p>
          </div>
        </div>
      </div>

      {/* 📊 LUXURY DATA SHEET TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">System ID / Admission</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Student Identity Profile</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Total Sessions Marked</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Attended Classes</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Attendance Ratio %</th>
                <th className="px-6 py-4 text-center text-[10px] font-black tracking-wide">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400 italic font-medium">
                    Database registry me koi records ya reports nahi mili bhai! 🎯
                  </td>
                </tr>
              ) : (
                reportData.map((row) => {
                  const total = parseInt(row.total_classes) || 0;
                  const attended = parseInt(row.attended_classes) || 0;
                  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

                  // Premium Conditional Design Architecture
                  let isShortage = percentage < 75;
                  let badgeStyle = isShortage 
                    ? "bg-rose-50 text-rose-700 border-rose-200/70" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200/70";
                  let percentageColor = isShortage ? "text-rose-600" : "text-slate-800";
                  let progressFill = isShortage ? "bg-rose-500" : "bg-emerald-500";

                  return (
                    <tr key={row.student_id} className="hover:bg-slate-50/40 transition-all group">
                      {/* System ID */}
                      <td className="px-6 py-4.5 font-mono text-slate-400 text-[11px] tracking-wide">
                        {row.admission_number || `#ADM-2026-0${row.student_id}`}
                      </td>
                      
                      {/* Name Profile */}
                      <td className="px-6 py-4.5">
                        <div className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                          {row.full_name}
                        </div>
                      </td>
                      
                      {/* Total Classes */}
                      <td className="px-6 py-4.5 font-mono font-bold text-slate-500 text-sm">
                        {total}
                      </td>
                      
                      {/* Attended Classes */}
                      <td className="px-6 py-4.5 font-mono font-bold text-emerald-600 text-sm">
                        {attended}
                      </td>
                      
                      {/* Percentage & Premium Progress Bar */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center space-x-3 max-w-[140px]">
                          <span className={`font-mono font-black text-sm w-10 ${percentageColor}`}>
                            {percentage}%
                          </span>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${progressFill}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Status Badge */}
                      <td className="px-6 py-4.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-wider ${badgeStyle}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isShortage ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                          {isShortage ? "🚨 Shortage" : "✓ Safe"}
                        </span>
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

export default AttendanceReport;