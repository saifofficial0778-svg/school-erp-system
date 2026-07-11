import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- 📦 SYSTEM STATES ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const [metrics, setMetrics] = useState({
    totalClasses: 0,
    totalSections: 0,
    submitted: 0,
    pending: 0,
    present: 0,
    absent: 0,
    leave: 0,
    attendanceRate: 0.0
  });

  const [studentRoster, setStudentRoster] = useState([]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // --- 🛠️ CHUNK 1: Fetch Live Dashboard Metrics ---
  const fetchLiveDashboardData = async () => {
    try {
      setLoading(true);
      const attendanceRes = await API.get(`/attendance?date=${selectedDate}`);

      // ✅ FIX: '/classes' → '/classes/meta-data' (matches classRoutes.js)
      const academicRes = await API.get('/classes/meta-data');

      let liveLogs = [];
      let classesData = [];

      if (attendanceRes?.data?.success) liveLogs = attendanceRes.data.data || [];

      if (academicRes?.data?.success) {
        // ✅ FIX: response key is 'classes', not 'data'
        classesData = academicRes.data.classes || [];
        setClassesList(classesData);
        if (classesData.length > 0 && !selectedClass) {
          setSelectedClass(classesData[0].id);
        }
      }

      const pCount = liveLogs.filter(r => r.status === 'present').length;
      const aCount = liveLogs.filter(r => r.status === 'absent').length;
      const lCount = liveLogs.filter(r => r.status === 'leave').length;
      const totalMarked = liveLogs.length;
      const rate = totalMarked > 0 ? ((pCount / totalMarked) * 100).toFixed(1) : 0.0;

      setMetrics({
        totalClasses: classesData.length,
        totalSections: classesData.length,
        submitted: totalMarked > 0 ? 1 : 0,
        pending: classesData.length - (totalMarked > 0 ? 1 : 0),
        present: pCount,
        absent: aCount,
        leave: lCount,
        attendanceRate: parseFloat(rate)
      });

      setLoading(false);
    } catch (error) {
      console.error("Dashboard core metrics fetch sync failure:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchLiveDashboardData();
  }, [selectedDate, user?.schoolId]);

  // --- 🛠️ CHUNK 2: Load Student Roster for Selected Class ---
  const loadStudentRoster = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);

      // ✅ FIX: '/students' (poore school ke students) → sirf selected class ke students
      const res = await API.get(`/classes/${selectedClass}/students`);

      const existingLogsRes = await API.get(`/attendance?date=${selectedDate}`);
      const liveLogs = existingLogsRes?.data?.success ? (existingLogsRes.data.data || []) : [];

      if (res?.data?.success) {
        const baseStudents = res.data.data || [];

        const rosterSetup = baseStudents.map(student => {
          const pastLog = liveLogs.find(log => log.student_id === student.id);
          return {
            studentId: student.id,
            fullName: student.fullName || student.full_name,
            rollNumber: student.rollNumber || student.roll_number,
            status: pastLog ? pastLog.status : 'present',
            remarks: pastLog ? (pastLog.remarks || '') : ''
          };
        });
        setStudentRoster(rosterSetup);
      }
      setLoading(false);
    } catch (error) {
      console.error("Roster generation error:", error.message);
      setStudentRoster([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mark' && user?.schoolId) {
      loadStudentRoster();
    }
  }, [activeTab, selectedClass, selectedDate, user?.schoolId]);

  const handleStatusChange = (studentId, newStatus) => {
    setStudentRoster(prev =>
      prev.map(item => item.studentId === studentId ? { ...item, status: newStatus } : item)
    );
  };

  const markAllAs = (status) => {
    setStudentRoster(prev => prev.map(item => ({ ...item, status })));
  };

  const submitAttendanceRoster = async () => {
    try {
      setSaving(true);
      for (const record of studentRoster) {
        const payload = {
          studentId: record.studentId,
          date: selectedDate,
          status: record.status,
          remarks: record.remarks || null
        };
        await API.post('/attendance', payload);
      }

      showToast('success', 'Attendance roster saved successfully! 🎉');
      setActiveTab('dashboard');
      fetchLiveDashboardData();
      setSaving(false);
    } catch (error) {
      console.error("Roster bulk submit error:", error.message);
      showToast('error', error.response?.data?.message || "Attendance save karne me dikkat aayi!");
      setSaving(false);
    }
  };

  // Currently selected class's full details (for the "class teacher" badge)
  const activeClassDetails = classesList.find(c => String(c.id) === String(selectedClass));

  // Roster summary counts (live, before saving)
  const rosterSummary = {
    present: studentRoster.filter(s => s.status === 'present').length,
    absent: studentRoster.filter(s => s.status === 'absent').length,
    leave: studentRoster.filter(s => s.status === 'leave').length,
  };

  const statCards = [
    { label: 'Total Classes', value: metrics.totalClasses, accent: 'from-violet-500 to-purple-600', icon: 'M4 6h16M4 12h16M4 18h7' },
    { label: 'Active Sections', value: metrics.totalSections, accent: 'from-blue-500 to-cyan-500', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { label: 'Submitted Sessions', value: metrics.submitted, accent: 'from-emerald-500 to-teal-500', icon: 'M5 13l4 4L19 7' },
    { label: 'Pending Sessions', value: metrics.pending, accent: 'from-amber-500 to-orange-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Present', value: metrics.present, accent: 'from-emerald-500 to-green-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Absent', value: metrics.absent, accent: 'from-rose-500 to-red-600', icon: 'M6 18L18 6M6 6l12 12' },
    { label: 'On Leave', value: metrics.leave, accent: 'from-blue-500 to-indigo-600', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 min-h-screen font-sans">

      {/* 🔔 Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-rose-600 text-white border-rose-700'
        }`}>
          <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          {toast.message}
        </div>
      )}

      {/* 📋 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 p-8 shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-3">
              Live · Connected to MySQL
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">Attendance Command Center</h1>
            <p className="text-sm text-indigo-200/80 mt-1.5">
              Track sessions, mark rosters, and monitor real-time attendance health across every class.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'dashboard' ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-100 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('mark')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'mark' ? 'bg-white text-indigo-900 shadow-md' : 'text-indigo-100 hover:text-white'
                }`}
              >
                Mark Roster
              </button>
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-indigo-200 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs text-white font-bold focus:outline-none cursor-pointer bg-transparent [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📋 VIEW 1: DASHBOARD ANALYTICS VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center mb-3 shadow-sm`}>
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
                <h3 className="text-3xl font-black text-slate-800 font-mono mt-1">{card.value}</h3>
              </div>
            ))}
          </div>

          {/* Rate Analysis Block */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none"></div>
            <div className="relative">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Attendance Rate</h2>
              <div className="flex items-end gap-3 mt-1">
                <h4 className="text-5xl font-black text-indigo-950 font-mono">{metrics.attendanceRate}%</h4>
                <div className="w-40 h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(metrics.attendanceRate, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">Consolidated attendance yield for {selectedDate}</p>
            </div>
            <button
              onClick={() => setActiveTab('mark')}
              className="relative bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              Open Active Roster Sheet
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 📋 VIEW 2: ACTIVE MARK ATTENDANCE SHEET */}
      {activeTab === 'mark' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Class Filter Header Row */}
          <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-white border border-gray-200 text-sm font-bold text-slate-700 px-4 py-2 rounded-xl outline-none cursor-pointer shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {classesList.length === 0 && <option value="">No classes found</option>}
                  {classesList.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.class_name} - Section {cls.section}</option>
                  ))}
                </select>
              </div>

              {activeClassDetails && (
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                  <span className="text-lg">🧑‍🏫</span>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Class Teacher</p>
                    <p className="text-xs font-bold text-slate-700">{activeClassDetails.teacher_name || 'Not Assigned'}</p>
                  </div>
                </div>
              )}

              {studentRoster.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] font-bold">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">✓ {rosterSummary.present} Present</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">✕ {rosterSummary.absent} Absent</span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">⏸ {rosterSummary.leave} Leave</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {studentRoster.length > 0 && (
                <>
                  <button
                    onClick={() => markAllAs('present')}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-all"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => markAllAs('absent')}
                    className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg transition-all"
                  >
                    Mark All Absent
                  </button>
                </>
              )}
              <button
                onClick={submitAttendanceRoster}
                disabled={saving || studentRoster.length === 0}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>💾 Save Roster to DB</>
                )}
              </button>
            </div>
          </div>

          {/* Student marking layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Roll No.</th>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-3 w-10 bg-slate-100 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-3 w-32 bg-slate-100 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-7 w-52 bg-slate-100 rounded-lg animate-pulse mx-auto"></div></td>
                    </tr>
                  ))
                ) : studentRoster.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🗂️</span>
                        <p className="text-gray-400 font-medium text-sm">No students enrolled in this class yet.</p>
                        <p className="text-gray-300 text-xs">Assign students from Class Management first.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  studentRoster.map((student) => (
                    <tr key={student.studentId} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {student.fullName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'present')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${student.status === 'present' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300'}`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'absent')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${student.status === 'absent' ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-rose-300'}`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'leave')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${student.status === 'leave' ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'}`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*
        🔒 RBAC HOOK (future):
        Jab RBAC lagega, is component ko teacher-login ke context me
        sirf 'user.assignedClassId' wali class dikhani hogi, aur
        classesList ko filter karna hoga: cls.teacher_id === user.teacherId
        Admin ke liye sab classes dikhti rahengi jaisa abhi hai.
      */}
    </div>
  );
};

export default Attendance;