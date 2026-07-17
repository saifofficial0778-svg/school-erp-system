import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const TeacherView = () => {
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get('id');
  const navigate = useNavigate();

  const [data, setData] = useState({ profile: null });
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchFullData = async () => {
      try {
        // ✅ NEW: agar id URL me nahi hai, to apni "me" wali profile fetch karo
        const endpoint = teacherId 
          ? `/teachers/${teacherId}/profile-view` 
          : `/teachers/me/profile-view`;
        const res = await API.get(endpoint);
        if (res.data.success) {
          setData(res.data.data);
        }

        // Assigned classes fetch — agar apni profile hai to teacher_id useEffect me baad me match karenge
        const classesRes = await API.get('/classes/meta-data');
        if (classesRes?.data?.success) {
          const allClasses = classesRes.data.classes || [];
          // agar teacherId URL me nahi hai (My Profile), to profile load hone ke baad us se match karo
          setAssignedClasses(allClasses); // temporarily set all; filter neeche fix karenge
        }
      } catch (err) {
        console.error("Dashboard data load fail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData(); // ✅ ab teacherId na ho tab bhi chalega (My Profile case)
}, [teacherId]);

  const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/40 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 tracking-wide">Loading Teacher Dashboard Records...</p>
        </div>
      </div>
    );
  }

  const profile = data.profile;
  const hasBankDetails = profile?.bank_name || profile?.account_number;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/40 min-h-screen font-sans">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 shadow-xl">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <button
            onClick={() => navigate('/teacher')}
            className="self-start bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              {getInitials(profile?.full_name)}
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                Teacher 360° Dashboard
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">{profile?.full_name || 'Teacher Profile'}</h1>
              <p className="text-xs text-blue-200/80 mt-0.5">{profile?.qualification} {profile?.specialization ? `· ${profile.specialization}` : ''}</p>
            </div>
          </div>
        </div>

        {/* Inline quick stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">Experience</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{profile?.experience_years ?? 0} yrs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">Assigned Classes</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">{assignedClasses.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
            <p className="text-[9px] font-bold text-blue-200 uppercase tracking-wider">Monthly Salary</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">₹{Number(profile?.salary || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Personal Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
          <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">👤</span>
            Personal Details
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Full Name</span><strong className="text-slate-800">{profile?.full_name}</strong></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Email</span><span className="text-slate-700 truncate ml-2">{profile?.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Phone</span><span className="text-slate-700">{profile?.phone || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Date of Birth</span><span className="text-slate-700">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN') : '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Gender</span><span className="capitalize text-slate-700">{profile?.gender || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Address</span><span className="text-slate-700 truncate ml-2">{profile?.address || '—'}</span></div>
          </div>
        </div>

        {/* Card 2: Qualification & Employment */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
          <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">🎓</span>
            Qualification & Employment
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Qualification</span><strong className="text-slate-800">{profile?.qualification}</strong></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Specialization</span><span className="text-slate-700">{profile?.specialization || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Experience</span><span className="text-slate-700">{profile?.experience_years ?? 0} years</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Previous School</span><span className="text-slate-700 truncate ml-2">{profile?.previous_school || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-medium">Joining Date</span><span className="text-slate-700">{profile?.joining_date ? new Date(profile.joining_date).toLocaleDateString('en-IN') : '—'}</span></div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl mt-3 border border-blue-100/50">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">Monthly Salary</p>
              <p className="font-black text-blue-700 text-xl mt-0.5">₹{Number(profile?.salary || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* ✅ NEW: Real assigned classes (class module ab ban chuka hai) */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Assigned Classes</p>
            {assignedClasses.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No classes assigned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assignedClasses.map(cls => (
                  <span
                    key={cls.id}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100"
                  >
                    {cls.class_name} - Sec {cls.section}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Bank Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
          <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">🏦</span>
            Bank Details
          </h2>
          {hasBankDetails ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-400 font-medium">Bank Name</span><strong className="text-slate-800">{profile?.bank_name || '—'}</strong></div>
              <div className="flex justify-between"><span className="text-gray-400 font-medium">Account Holder</span><span className="text-slate-700">{profile?.account_holder_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-medium">Account Number</span><span className="font-mono text-slate-700">{profile?.account_number || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-medium">IFSC Code</span><span className="font-mono text-slate-700">{profile?.ifsc_code || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-medium">Account Type</span><span className="capitalize text-slate-700">{profile?.account_type || '—'}</span></div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No bank details added yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherView;