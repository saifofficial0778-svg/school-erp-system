import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AttendanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

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
  }, []);

  const getClassLabel = (item) =>
    item.class_name
      ? `${item.class_name}${item.section ? ' - Sec ' + item.section : ''}`
      : 'N/A';

  const uniqueClasses = ['All', ...new Set(
    reportData.map(item => getClassLabel(item)).filter(label => label !== 'N/A')
  )];

  const filteredData = reportData.filter(row => {
    const matchesSearch =
      (row.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.admission_number || '').toString().toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'All' || getClassLabel(row) === selectedClass;

    return matchesSearch && matchesClass;
  });

  const totalTracked = filteredData.length;
  const shortageCount = filteredData.filter(s => {
    const total = s.total_classes || 0;
    const attended = s.attended_classes || 0;
    const pct = total > 0 ? (attended / total) * 100 : 0;
    return pct < 75;
  }).length;

  const avgAttendance = totalTracked > 0
    ? Math.round(filteredData.reduce((sum, s) => {
        const total = s.total_classes || 0;
        const attended = s.attended_classes || 0;
        return sum + (total > 0 ? (attended / total) * 100 : 0);
      }, 0) / totalTracked)
    : 0;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 min-h-screen font-sans antialiased">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-violet-900 to-indigo-900 p-8 shadow-xl">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-3">
            Analytics Intelligence
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Monthly Attendance Insights</h1>
          <p className="text-sm text-indigo-200/80 mt-1.5">Analyze student consistency and automatically flag low attendance defaulters live.</p>
        </div>

        <div className="relative grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider">Total Audited</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{totalTracked}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider">Avg. Attendance</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{avgAttendance}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-rose-300 uppercase tracking-wider">Shortage Alerts</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{shortageCount}</p>
          </div>
        </div>
      </div>

      {/* 🎯 FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by student name or admission number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col gap-1 sm:w-56">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📊 DATA SHEET TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">System ID / Admission</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Student Identity Profile</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Class</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Total Sessions Marked</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Attended Classes</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-wide">Attendance Ratio %</th>
                <th className="px-6 py-4 text-center text-[10px] font-black tracking-wide">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="7" className="px-6 py-4.5">
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400 italic font-medium">
                    Is filter ke hisab se koi records nahi mile bhai! 🎯
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const total = parseInt(row.total_classes) || 0;
                  const attended = parseInt(row.attended_classes) || 0;
                  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

                  let isShortage = percentage < 75;
                  let badgeStyle = isShortage
                    ? "bg-rose-50 text-rose-700 border-rose-200/70"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200/70";
                  let percentageColor = isShortage ? "text-rose-600" : "text-slate-800";
                  let progressFill = isShortage ? "bg-rose-500" : "bg-indigo-500";

                  return (
                    <tr key={row.student_id} className="hover:bg-slate-50/40 transition-all group">
                      <td className="px-6 py-4.5 font-mono text-slate-400 text-[11px] tracking-wide">
                        {row.admission_number || `#ADM-2026-0${row.student_id}`}
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                          {row.full_name}
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          {getClassLabel(row)}
                        </span>
                      </td>

                      <td className="px-6 py-4.5 font-mono font-bold text-slate-500 text-sm">
                        {total}
                      </td>

                      <td className="px-6 py-4.5 font-mono font-bold text-emerald-600 text-sm">
                        {attended}
                      </td>

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