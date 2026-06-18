import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Attendance = () => {
  // --- 📦 STATES (DB SCHEMA ALIGNED) ---
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 📝 FORM STATES (Inputs mapped directly to SQL schema columns) ---
  const [schoolId, setSchoolId] = useState('1'); // Hidden or automated multi-tenant filter
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [status, setStatus] = useState('present'); // ENUM('present', 'absent', 'leave')
  const [remarks, setRemarks] = useState('');

  // --- 🛠️ CHUNK 1: Fetch Today's Attendance logs (GET Request) ---
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/attendance?date=${date}`)
        // Safe-guard lagate hain jaise kal bacho ke liye lagaya tha
        if (res && res.data && Array.isArray(res.data.data)) {
          setAttendanceRecords(res.data.data); // 🎯 Ekdum correct targeting!
        } else if (res && res.data && Array.isArray(res.data)) {
          setAttendanceRecords(res.data);
        } else if (res && Array.isArray(res)) {
          setAttendanceRecords(res);
        } else {
          setAttendanceRecords([]);
        }


        setLoading(false);
      } catch (error) {
        console.error("Attendance fetch nahi ho payi bhai:", error);
        setAttendanceRecords([]);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [date]); // Re-fetch logs automatically whenever date changes


  // --- 🛠️ CHUNK 2: Mark/Submit Attendance (POST Request) ---
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !date || !status) {
      return alert("Bhai, saari mandatory fields bhariye pehle!");
    }

    try {
      setLoading(true)
      // 🎯 EXACT DATABASE COLUMN SCHEMA MATCHING PAYLOAD
      const attendancePayload = {
        school_id: parseInt(schoolId),
        student_id: parseInt(studentId),
        date: date,
        status: status, // 'present', 'absent', 'leave'
        remarks: remarks || null
      };

      console.log("Sending backend synchronization payload...", attendancePayload);
      API.post('/attendance',attendancePayload);
      setAttendanceRecords((prev)=>[...(prev||[]),attendancePayload])
      setStudentId("")
      setRemarks("")

      alert("Attendance mark ho gayi makkhan tarike se! 🎉🔥");
    } catch (error) {
      console.error("Attendance post fail ho gayi bhai:", error);
      alert("Kuch gadbad hui, backend logs ya unique constraints check karo!");
    }
    setLoading(false)
  };

  return (
    <div className="space-y-6 p-4">
      {/* 📋 Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">📊 Attendance Control Connect</h1>
        <p className="text-sm text-gray-500">Live operational link to daily school attendance rosters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 📋 LEFT SIDE: MARK ATTENDANCE REGISTRATION FORM */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🖋️ Mark Student Status</h2>

          <form onSubmit={handleAttendanceSubmit} className="space-y-4">
            {/* School Tenant ID Field (Hidden or Static Control) */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">School Environment ID</label>
              <input
                type="number"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full bg-slate-100 border border-gray-200 px-3 py-2 rounded-xl text-sm text-gray-500 outline-none"
                readOnly
              />
            </div>

            {/* student_id Input mapping */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Student Database ID</label>
              <input
                type="text"
                placeholder="e.g. 24"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* date Picker Input mapping */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Log Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* status Selection matching ENUM values */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Attendance Status (ENUM)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="present">🟢 Present</option>
                <option value="absent">🔴 Absent</option>
                <option value="leave">🟡 Leave</option>
              </select>
            </div>

            {/* remarks Text Field mapping */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Remarks / Notes</label>
              <input
                type="text"
                placeholder="e.g. Medical Leave or Late Arrival"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm"
            >
              🚀 Commit Log To Database
            </button>
          </form>
        </div>

        {/* 📊 RIGHT SIDE: REAL-TIME LEDGER ROSTER */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-sm font-semibold text-gray-500 animate-pulse">
              🔄 Syncing with Remote Index Logs...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3.5">Student ID</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">

                  {/* 🛠️ CHUNK 3: Live Dynamic Mapping Loop */}
                  {!attendanceRecords || attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                        No active roster logs registered for this date.
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record, index) => (
                      <tr key={record.id || index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                          {record.student_id}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {record.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${record.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                              record.status === 'absent' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 italic">
                          {record.remarks || "—"}
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Attendance;