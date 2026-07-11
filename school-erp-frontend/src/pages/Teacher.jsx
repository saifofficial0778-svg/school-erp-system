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

  const handleEdit = (teacherId) => {
    navigate(`/teacher/new?id=${teacherId}`);
  };

  const handleDelete = async (teacherId, teacherName) => {
    const confirmDelete = window.confirm(`Bhai, kya aap sach me ${teacherName} ka profile delete karna chahte ho?`);
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await API.delete(`/teachers/${teacherId}`);

      if (res.data.success || res.status === 200) {
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
    const spec = (t.specialization || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || qual.includes(term) || spec.includes(term);
  });

  // Directory-wide stats
  const totalExperience = teacherList.reduce((sum, t) => sum + (parseInt(t.experienceYears ?? t.experience_years) || 0), 0);
  const avgExperience = teacherList.length > 0 ? (totalExperience / teacherList.length).toFixed(1) : 0;
  const specializations = new Set(teacherList.map(t => t.specialization).filter(Boolean));

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  // Deterministic gradient per teacher, based on id, so it's stable across renders
  const avatarGradients = [
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
  ];
  const gradientFor = (id) => avatarGradients[(id || 0) % avatarGradients.length];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/40 min-h-screen font-sans">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 shadow-xl">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-3">
              Faculty Directory
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">Teaching Staff</h1>
            <p className="text-sm text-blue-200/80 mt-1.5">Manage every educator's profile, qualifications, and employment record.</p>
          </div>

          <button
            onClick={() => navigate('/teacher/new')}
            className="bg-white hover:bg-blue-50 text-blue-900 font-bold text-sm px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 self-start lg:self-auto"
          >
            <span className="text-lg leading-none">＋</span> Add Teacher
          </button>
        </div>

        {/* Inline directory stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">Total Faculty</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">{teacherList.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">Avg. Experience</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">{avgExperience} yrs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">Specializations</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">{specializations.size}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, qualification, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/60 border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 🗂️ FACULTY CARD GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-slate-100 mb-4"></div>
              <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
              <div className="h-3 w-24 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <span className="text-4xl">🧑‍🏫</span>
          <p className="text-gray-400 font-medium text-sm mt-3">No teachers found.</p>
          <p className="text-gray-300 text-xs mt-1">Try a different search, or add a new faculty member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((teacher) => {
            const currentName = teacher.fullName || teacher.full_name;
            const experience = teacher.experienceYears ?? teacher.experience_years ?? 0;
            return (
              <div
                key={teacher.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                {/* Card top */}
                <div className="p-5 flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientFor(teacher.id)} flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0`}>
                    {getInitials(currentName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{currentName}</h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">#{teacher.id || 'TEMP'}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${(teacher.gender || '').toLowerCase() === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                      {teacher.gender || '—'}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 pb-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-slate-300">🎓</span>
                    <span className="font-semibold">{teacher.qualification || '—'}</span>
                    {teacher.specialization && (
                      <span className="text-slate-400">· {teacher.specialization}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-slate-300">📞</span>
                    <span>{teacher.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-slate-300">⏳</span>
                    <span className="font-semibold">{experience} {experience === 1 ? 'year' : 'years'} experience</span>
                  </div>
                </div>

                {/* Card footer — actions */}
                <div className="flex items-center justify-end gap-2 px-5 py-3 bg-slate-50/60 border-t border-gray-100">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Teacher;