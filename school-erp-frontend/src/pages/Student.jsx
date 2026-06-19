import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Student = () => {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const schoolId = '1'; // TODO: auth context se laana baad me

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/students?schoolId=${schoolId}`);

        if (res?.data?.data && Array.isArray(res.data.data)) {
          setStudentList(res.data.data);
        } else if (Array.isArray(res?.data)) {
          setStudentList(res.data);
        } else {
          setStudentList([]);
        }
      } catch (error) {
        console.error("Students load fail ho gayi:", error);
        setStudentList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [schoolId]);

  const filteredList = studentList.filter((s) => {
    const name = (s.fullName || s.full_name || '').toLowerCase();
    const adm = (s.admissionNumber || s.admission_number || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || adm.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">

      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-900 tracking-tight">Student</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all enrolled students.</p>
        </div>
        <button
          onClick={() => navigate('/student/new')}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>＋</span> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <input
          type="text"
          placeholder="Search by name, admission no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50/60 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3.5 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Enrollment Index</span>
          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-mono">
            Count: {filteredList.length}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-semibold text-gray-400 animate-pulse">
            🔄 Loading students...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3.5">System ID</th>
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Admission No.</th>
                  <th className="px-6 py-3.5">Roll Number</th>
                  <th className="px-6 py-3.5">Gender</th>
                  <th className="px-6 py-3.5">Guardian Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((student, index) => (
                    <tr key={student.id || index} className="hover:bg-slate-50/40 transition-all">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-purple-600">
                        #{student.id || "TEMP"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {student.fullName || student.full_name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {student.admissionNumber || student.admission_number}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                        {student.rollNumber || student.roll_number}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          (student.gender || '').toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                        }`}>
                          {student.gender || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 italic">
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
  );
};

export default Student;