import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Student = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 Fetch Students Function
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/students');

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

  useEffect(() => {
    if (user?.schoolId) fetchStudents();
  }, [user?.schoolId]);

  // ✏️ EDIT HANDLER: StudentForm par redirect karega query param lekar
  const handleEdit = (studentId) => {
    navigate(`/student/new?id=${studentId}`); // 🎯 /student/new par hi bhej do
  };

  // 🗑️ DELETE HANDLER
  const handleDelete = async (studentId, studentName) => {
    const confirmDelete = window.confirm(`Bhai, kya aap sach me ${studentName} ka profile delete karna chahte ho?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await API.delete(`/students/${studentId}`);

      if (res.data.success || res.status === 200) {
        alert("Student successfully remove ho gaya! 🗑️");
        setStudentList((prev) => prev.filter((student) => student.id !== studentId));
      }
    } catch (error) {
      console.error("Delete operation failure:", error);
      alert(error.response?.data?.message || "Server error while deleting student!");
    } finally {
      setLoading(false);
    }
  };

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
            🔄 Syncing database logs...
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
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-400 font-medium">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((student, index) => {
                    const currentName = student.fullName || student.full_name;
                    return (
                      <tr key={student.id || index} className="hover:bg-slate-50/40 transition-all">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-purple-600">
                          #{student.id || "TEMP"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {currentName}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {student.admissionNumber || student.admission_number}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                          {student.rollNumber || student.roll_number}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${(student.gender || '').toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                            }`}>
                            {student.gender || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 italic">
                          {student.guardianName || student.guardian_name || "—"}
                        </td>

                        {/* Actions Control Box */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => navigate(`/student/profile-view?id=${student.id}`)} // 🎯 Sahi path match kar diya query param ke sath!
                              title="View Full Profile"
                              className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(student.id)}
                              title="Edit Student"
                              className="text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 p-2 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDelete(student.id, currentName)}
                              title="Delete Student"
                              className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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