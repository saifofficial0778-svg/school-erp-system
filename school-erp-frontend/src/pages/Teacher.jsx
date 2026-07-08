import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Teacher = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacherList, setTeacherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔄 Fetch Teachers Function
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/teachers');

      if (res?.data?.data && Array.isArray(res.data.data)) {
        setTeacherList(res.data.data);
      } else if (Array.isArray(res?.data)) {
        setTeacherList(res.data);
      } else {
        setTeacherList([]);
      }
    } catch (error) {
      console.error("Teachers load fail ho gayi:", error);
      setTeacherList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) fetchTeachers();
  }, [user?.schoolId]);

  // ✏️ EDIT HANDLER: TeacherForm par redirect karega query param lekar
  const handleEdit = (teacherId) => {
    navigate(`/teacher/new?id=${teacherId}`); // 🎯 /teacher/new par hi bhej do
  };

  // 🗑️ DELETE HANDLER
  const handleDelete = async (teacherId, teacherName) => {
    const confirmDelete = window.confirm(`Bhai, kya aap sach me ${teacherName} ka profile delete karna chahte ho?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await API.delete(`/teachers/${teacherId}`);

      if (res.data.success || res.status === 200) {
        alert("Teacher successfully remove ho gaya! 🗑️");
        setTeacherList((prev) => prev.filter((teacher) => teacher.id !== teacherId));
      }
    } catch (error) {
      console.error("Delete operation failure:", error);
      alert(error.response?.data?.message || "Server error while deleting teacher!");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = teacherList.filter((t) => {
    const name = (t.fullName || t.full_name || '').toLowerCase();
    const qual = (t.qualification || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || qual.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 tracking-tight">Teacher</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage all onboarded teachers.</p>
        </div>
        <button
          onClick={() => navigate('/teacher/new')}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>＋</span> Add Teacher
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <input
          type="text"
          placeholder="Search by name, qualification..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50/60 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3.5 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Faculty Index</span>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-mono">
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
                  <th className="px-6 py-3.5">Qualification</th>
                  <th className="px-6 py-3.5">Specialization</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Experience</th>
                  <th className="px-6 py-3.5">Gender</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-gray-400 font-medium">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((teacher, index) => {
                    const currentName = teacher.fullName || teacher.full_name;
                    return (
                      <tr key={teacher.id || index} className="hover:bg-slate-50/40 transition-all">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">
                          #{teacher.id || "TEMP"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {currentName}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {teacher.qualification || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {teacher.specialization || "—"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {teacher.phone || "—"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                          {teacher.experienceYears ?? teacher.experience_years ?? 0} yrs
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${(teacher.gender || '').toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                            }`}>
                            {teacher.gender || "—"}
                          </span>
                        </td>

                        {/* Actions Control Box */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => navigate(`/teacher/profile-view?id=${teacher.id}`)}
                              title="View Full Profile"
                              className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(teacher.id)}
                              title="Edit Teacher"
                              className="text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 p-2 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDelete(teacher.id, currentName)}
                              title="Delete Teacher"
                              className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.166 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

export default Teacher;