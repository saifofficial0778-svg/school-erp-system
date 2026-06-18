import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Student = () => {
  // --- 📦 STATES (DB SCHEMA ALIGNED) ---
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 📝 FORM STATES (Core Profile Fields Only) ---
  const [schoolId, setSchoolId] = useState('1'); // Static multi-tenant link
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');

  // --- 🛠️ CHUNK 1: Fetch All Registered Students (GET Request) ---
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        // GET request to fetch base profiles
        const res = await API.get(`/students?schoolId=${schoolId}`);
        
        // 🛡️ Safe-guard targeting for array data
        if (res && res.data && Array.isArray(res.data.data)) {
          setStudentList(res.data.data); 
        } else if (res && res.data && Array.isArray(res.data)) {
          setStudentList(res.data);
        } else if (res && Array.isArray(res)) {
          setStudentList(res);
        } else {
          setStudentList([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Students list nahi aayi bhai:", error);
        setStudentList([]);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [schoolId]);


  // --- 🛠️ CHUNK 2: Register Student Profile Only (POST Request) ---
  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !rollNumber || !guardianName) {
      return alert("Bhai, saari mandatory fields bharo pehle!");
    }

    try {
      setLoading(true);

      // 🎯 NO CLASS HARDCODING — PURE PROFILE PAYLOAD
      const studentPayload = {
        schoolId: parseInt(schoolId),
        fullName: fullName,
        rollNumber: parseInt(rollNumber),
        guardianName: guardianName,
        
        // Core User account defaults (Required by backend user table)
        email: `student_${rollNumber}_${Date.now()}@edusuite.com`, 
        password: "password123"                    
      };

      console.log("Sending backend profile payload...", studentPayload);

      // Fire POST call to independent registration endpoint
      const res = await API.post('/students', studentPayload);

      // 🚀 Sync state smoothly on 201 Success
      if (res && res.data && res.data.success) {
        const savedStudent = res.data.data || studentPayload;
        setStudentList((prev) => [...(prev || []), savedStudent]);
      } else {
        const savedStudent = res.data || studentPayload;
        setStudentList((prev) => [...(prev || []), savedStudent]);
      }

      // 🧹 Clean inputs perfectly
      setFullName('');
      setRollNumber('');
      setGuardianName('');

      setLoading(false);
      alert("Student Profile registered successfully! Class baad me assign karenge. 🎉🔥");
    } catch (error) {
      setLoading(false);
      console.error("Student post fail ho gayi:", error);
      alert(error.response?.data?.message || "Unique Roll Number constraint ya koi validation error hai bhai!");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 📋 Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">🎓 Student Central Registry</h1>
        <p className="text-sm text-gray-500">Admission desk for registering core student profiles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📋 LEFT SIDE: INDEPENDENT REGISTRATION FORM */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🖋️ Admission Profile</h2>
          
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            {/* School Environment ID */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">School Environment ID</label>
              <input
                type="number"
                value={schoolId}
                className="w-full bg-slate-100 border border-gray-200 px-3 py-2 rounded-xl text-sm text-gray-500 outline-none"
                readOnly
              />
            </div>

            {/* fullName Input */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Student Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* rollNumber Input */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Roll Number (Unique)</label>
              <input
                type="number"
                placeholder="e.g. 101"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* guardianName Input */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Guardian Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm"
            >
              {loading ? "⌛ Saving Profile..." : "🚀 Register Student"}
            </button>
          </form>
        </div>

        {/* 📊 RIGHT SIDE: TOTAL REGISTERED PROFILES */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-sm font-semibold text-gray-500 animate-pulse">
              🔄 Syncing Master Registry Ledger...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3.5">System ID</th>
                    <th className="px-6 py-3.5">Full Name</th>
                    <th className="px-6 py-3.5">Roll Number</th>
                    <th className="px-6 py-3.5">Guardian Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  
                  {!studentList || studentList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                        No student registered in this environment yet.
                      </td>
                    </tr>
                  ) : (
                    studentList.map((student, index) => (
                      <tr key={student.id || index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                          {student.id || "TEMP"}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {student.fullName || student.full_name}
                        </td>
                        <td className="px-6 py-4 font-semibold text-blue-600">
                          {student.rollNumber || student.roll_number}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {student.guardianName || student.guardian_name || "—"}
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

export default Student;