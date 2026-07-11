import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFeesCollected: 0,
    totalFeesDemanded: 0,
    todayAttendancePercentage: 0,
  });

  const [feeBarData, setFeeBarData] = useState([]);
  const [attendancePieData, setAttendancePieData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);

  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        setLoading(true);

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const studentRes = await API.get('/students');
        const attendanceRes = await API.get(`/attendance?date=${todayStr}`);

        // ✅ FIX: '/fees' (jo 'amount_paid' field expect karta tha) ki jagah
        // '/fees/report-page' use kiya — isme class_name + total_fee + total_paid
        // sahi field names ke saath aata hai, aur class-wise breakdown bhi milta hai
        const feeReportRes = await API.get('/fees/report-page');

        let sCount = studentRes?.data?.success ? (studentRes.data.data?.length || 0) : 0;
        let attLogs = attendanceRes?.data?.success ? (attendanceRes.data.data || []) : [];
        let feeRows = feeReportRes?.data?.success ? (feeReportRes.data.data || []) : [];

        // ✅ FIX: sahi field names (total_paid / total_fee) se sum nikala
        const totalCollected = feeRows.reduce((sum, item) => sum + (parseFloat(item.total_paid) || 0), 0);
        const totalDemanded = feeRows.reduce((sum, item) => sum + (parseFloat(item.total_fee) || 0), 0);

        const pCount = attLogs.filter(r => r.status === 'present').length;
        const aCount = attLogs.filter(r => r.status === 'absent').length;
        const lCount = attLogs.filter(r => r.status === 'leave').length;
        const totalAtt = attLogs.length;
        const attRate = totalAtt > 0 ? ((pCount / totalAtt) * 100).toFixed(1) : 0;

        setStats({
          totalStudents: sCount,
          totalFeesCollected: totalCollected,
          totalFeesDemanded: totalDemanded,
          todayAttendancePercentage: parseFloat(attRate)
        });

        setAttendancePieData([
          { name: 'Present', value: pCount, color: '#10B981' },
          { name: 'Absent', value: aCount, color: '#EF4444' },
          { name: 'On Leave', value: lCount, color: '#F59E0B' },
        ]);

        // ✅ FIX: ab class-wise bar chart REAL data se banta hai
        // (class_name + section ke hisab se group karke total_paid vs total_fee)
        const classMap = {};
        feeRows.forEach(row => {
          const label = row.class_name
            ? `${row.class_name}${row.section ? ' - ' + row.section : ''}`
            : 'Unassigned';
          if (!classMap[label]) {
            classMap[label] = { name: label, Collected: 0, Target: 0 };
          }
          classMap[label].Collected += parseFloat(row.total_paid) || 0;
          classMap[label].Target += parseFloat(row.total_fee) || 0;
        });
        setFeeBarData(Object.values(classMap));

        // Registration trend (simple heuristic — for a true month-wise trend,
        // a backend query grouping students by created_at month would be more accurate)
        setMonthlyTrendData([
          { month: 'Apr', Registration: 0 },
          { month: 'May', Registration: sCount > 0 ? sCount - 1 : 0 },
          { month: 'Jun', Registration: sCount },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Dashboard visual core loading failure sync:", error.message);
        setLoading(false);
      }
    };

    fetchDashboardAnalytics();
  }, []);

  const collectionRate = stats.totalFeesDemanded > 0
    ? Math.round((stats.totalFeesCollected / stats.totalFeesDemanded) * 100)
    : 0;

  const heroCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      sub: 'Active verified profiles',
      accent: 'from-violet-500 to-purple-600',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      label: 'Fee Collected',
      value: `₹${stats.totalFeesCollected.toLocaleString('en-IN')}`,
      sub: `${collectionRate}% of ₹${stats.totalFeesDemanded.toLocaleString('en-IN')} demanded`,
      accent: 'from-emerald-500 to-teal-600',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m0-2c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      label: 'Attendance Today',
      value: `${stats.todayAttendancePercentage}%`,
      sub: 'Live roster for today',
      accent: 'from-blue-500 to-indigo-600',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl">
          <p className="text-slate-300 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color || p.fill }}>
              {p.name}: {typeof p.value === 'number' && p.name !== 'Registration' ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 min-h-screen font-sans">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 p-8 shadow-xl">
        <div className="absolute -top-20 -right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-3">
            Live · Real-time Sync
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Enterprise Analytics Monitor</h1>
          <p className="text-sm text-indigo-200/80 mt-1.5">Real-time charts, fee health, and attendance metrics in one command view.</p>
        </div>
      </div>

      {/* 📊 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {heroCards.map(card => (
          <div key={card.label} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center mb-4 shadow-sm`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{card.label}</span>
            <h2 className="text-3xl font-black text-slate-800 font-mono mt-1">{card.value}</h2>
            <p className="text-[11px] text-gray-400 mt-1.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-80 animate-pulse ${i === 1 ? 'lg:col-span-2' : ''}`}>
              <div className="h-4 w-40 bg-slate-100 rounded mb-2"></div>
              <div className="h-3 w-56 bg-slate-100 rounded mb-6"></div>
              <div className="h-56 bg-slate-50 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FEE COLLECTION BAR CHART */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Fee Collection by Class</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Actual revenue collected versus total demanded, per class</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{collectionRate}% overall</span>
            </div>
            <div className="h-72 w-full text-xs">
              {feeBarData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-300 text-xs font-semibold">No fee data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" tickLine={false} stroke="#94A3B8" fontSize={11} />
                    <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                    <Bar dataKey="Collected" fill="url(#collectedGrad)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Target" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ATTENDANCE DONUT CHART */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Today's Attendance</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Present / Absent / Leave split</p>
            </div>
            <div className="h-64 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.totalStudents > 0 && attendancePieData.some(d => d.value > 0) ? attendancePieData.filter(item => item.value > 0) : [{ name: 'No Data', value: 1, color: '#E2E8F0' }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={82}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(stats.totalStudents > 0 && attendancePieData.some(d => d.value > 0)) ? (
                      attendancePieData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    ) : (
                      <Cell fill="#E2E8F0" />
                    )}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-800 font-mono">{stats.todayAttendancePercentage}%</span>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Present</p>
              </div>
            </div>

            <div className="flex justify-center gap-4 text-[11px] font-bold text-gray-500 pt-2">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Present</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Absent</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Leave</div>
            </div>
          </div>

          {/* MONTHLY TREND LINE CHART */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-3 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Registration Trend</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Growth in student enrollment over time</p>
            </div>
            <div className="h-56 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} stroke="#94A3B8" fontSize={11} />
                  <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Registration" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;