import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Attendance = () => {
  // 🟢 HELPER FUNCTION: Aaj ki date ko dynamic YYYY-MM-DD format me compute karna
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- 📦 SYSTEM STATES ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'mark'
  const [loading, setLoading] = useState(false);
  
  // ✅ FIXED: Ab selectedDate ka default fallback 'getTodayDateString()' par set ho chuka hai
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [schoolId] = useState('1');

  // Academic filters for roster
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  // Live counters state
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

  // Active student roster sheet for marking
  const [studentRoster, setStudentRoster] = useState([]);

  // --- 🛠️ CHUNK 1: Fetch Live Dashboard Metrics ---
  const fetchLiveDashboardData = async () => {
    try {
      setLoading(true);
      const attendanceRes = await API.get('/attendance');
      const academicRes = await API.get('/classes'); 

      let liveLogs = [];
      let classesData = [];

      if (attendanceRes?.data?.success) liveLogs = attendanceRes.data.data || [];
      if (academicRes?.data?.success) {
        classesData = academicRes.data.data || [];
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
        late: 0, 
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
    fetchLiveDashboardData();
  }, [selectedDate, schoolId]);

  // --- 🛠️ CHUNK 2: Load Student Roster for Selected Class ---
  const loadStudentRoster = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      // Master registry se saare live register bache uthaye (chahe naye hon ya purane)
      const res = await API.get('/students');
      
      // Live database me aaj ki date ke marked logs le kar aaye fallback checks ke liye
      const existingLogsRes = await API.get(`/attendance?date=${selectedDate}`);
      const liveLogs = existingLogsRes?.data?.success ? (existingLogsRes.data.data || []) : [];

      if (res?.data?.success) {
        const baseStudents = res.data.data || [];
        
        const rosterSetup = baseStudents.map(student => {
          // Check karo kya is bachhe ki attendance subah lag chuki h?
          const pastLog = liveLogs.find(log => log.student_id === student.id);

          return {
            studentId: student.id,
            fullName: student.fullName || student.full_name,
            rollNumber: student.rollNumber || student.roll_number,
            // 🔥 ADVANCED FILTER: Agar pehle se status marked h toh wahi dikhao, varna default 'present' do!
            status: pastLog ? pastLog.status : 'present', 
            remarks: pastLog ? (pastLog.remarks || '') : ''
          };
        });
        setStudentRoster(rosterSetup);
      }
      setLoading(false);
    } catch (error) {
      console.error("Roster generation error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mark') {
      loadStudentRoster();
    }
  }, [activeTab, selectedClass, selectedDate]);

  // --- 🛠️ CHUNK 3: Handle Status Toggle in UI Sheet ---
  const handleStatusChange = (studentId, newStatus) => {
    setStudentRoster(prev => 
      prev.map(item => item.studentId === studentId ? { ...item, status: newStatus } : item)
    );
  };

  // --- 🛠️ CHUNK 4: Submit Roster List to Live DB ---
  const submitAttendanceRoster = async () => {
    try {
      setLoading(true);
      
      // Loop chala kar ek-ek student ka record database me push kiya (Ab back-end upsert use karega)
      for (const record of studentRoster) {
        const payload = {
          schoolId: parseInt(schoolId),
          studentId: record.studentId,
          date: selectedDate,
          status: record.status,
          remarks: record.remarks || null
        };
        await API.post('/attendance', payload);
      }

      alert("Master attendance roster successfully committed to DB! 🎉");
      setActiveTab('dashboard');
      fetchLiveDashboardData(); 
    } catch (error) {
      console.error("Roster bulk submit error:", error.message);
      alert(error.response?.data?.message || "Attendance process mark karne me dikkat aayi bhai!");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen font-sans">
      
      {/* 📋 UPPER BLOCK: Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Ledger</h1>
          <p className="text-xs text-gray-500 mt-0.5">Enterprise session verification interface connected to MySQL</p>
        </div>
        
        {/* Date Selector & Tab Switchers Row */}
        <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-200/60 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white text-purple-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Overview Metrics
            </button>
            <button 
              onClick={() => setActiveTab('mark')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'mark' ? 'bg-white text-purple-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Mark Attendance Roster
            </button>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs text-gray-700 font-bold focus:outline-none cursor-pointer bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* 📋 VIEW 1: DASHBOARD ANALYTICS VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Classes Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-600"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Classes</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.totalClasses}</h3>
            </div>

            {/* Total Sections Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Active Sections</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.totalSections}</h3>
            </div>

            {/* Submitted Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Submitted Sessions</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.submitted}</h3>
            </div>

            {/* Pending Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Pending Roster Sessions</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.pending}</h3>
            </div>

            {/* Present Count Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Present Count</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.present}</h3>
            </div>

            {/* Absent Count Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Absent Count</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.absent}</h3>
            </div>

            {/* Leave Count Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Leave Matrix</p>
              <h3 className="text-2xl font-black text-slate-800 font-mono mt-1">{metrics.leave}</h3>
            </div>
          </div>

          {/* Rate Analysis Block */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Yield Performance</h2>
              <h4 className="text-4xl font-black text-purple-950 font-mono mt-1">{metrics.attendanceRate}%</h4>
              <p className="text-[11px] text-gray-400 mt-1">Consolidated attendance rate data yield for current date</p>
            </div>
            <button 
              onClick={() => setActiveTab('mark')}
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md transition-all"
            >
              Open Active Roster Sheet
            </button>
          </div>
        </div>
      )}

      {/* 📋 VIEW 2: ACTIVE MARK ATTENDANCE SHEET */}
      {activeTab === 'mark' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Class Filter Header Row */}
          <div className="p-4 bg-slate-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-gray-500 uppercase">Target Environment Class:</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-lg outline-none cursor-pointer"
              >
                {classesList.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.class_name} - Section {cls.section}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={submitAttendanceRoster}
              disabled={loading || studentRoster.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-sm"
            >
              {loading ? "Syncing..." : "💾 Save Roster Sheet to DB"}
            </button>
          </div>

          {/* Student marking layout index list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3">Student Full Name</th>
                  <th className="px-6 py-3 text-center">Attendance Verification Status Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {studentRoster.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400 font-medium">
                      No student records found in this environment. Master registry database check karein.
                    </td>
                  </tr>
                ) : (
                  studentRoster.map((student) => (
                    <tr key={student.studentId} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {student.fullName}
                      </td>
                      
                      {/* Professional Toggle Segment */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'present')}
                            className={`px-4 py-1 text-xs font-bold rounded-lg border transition-all ${student.status === 'present' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-500'}`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'absent')}
                            className={`px-4 py-1 text-xs font-bold rounded-lg border transition-all ${student.status === 'absent' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-gray-200 text-gray-500'}`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'leave')}
                            className={`px-4 py-1 text-xs font-bold rounded-lg border transition-all ${student.status === 'leave' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}
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

    </div>
  );
};

export default Attendance;