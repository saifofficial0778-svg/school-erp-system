import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const TeacherView = () => {
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get('id');
  const navigate = useNavigate();

  const [data, setData] = useState({ profile: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await API.get(`/teachers/${teacherId}/profile-view`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard data load fail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (teacherId) fetchFullData();
  }, [teacherId]);

  if (loading) return <div className="p-10 text-center text-gray-500">🔄 Loading Teacher Dashboard Records...</div>;

  const profile = data.profile;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <button onClick={() => navigate('/teacher')} className="text-xl font-bold bg-white p-2 rounded-lg shadow-sm border">← Back</button>
        <h1 className="text-2xl font-bold text-slate-800">Teacher 360° Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Personal Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">👤 Personal Details</h2>
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-500">Full Name:</span> <strong>{profile?.full_name}</strong></p>
            <p><span className="text-gray-500">Email:</span> {profile?.email}</p>
            <p><span className="text-gray-500">Phone:</span> {profile?.phone || '—'}</p>
            <p><span className="text-gray-500">Date of Birth:</span> {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN') : '—'}</p>
            <p><span className="text-gray-500">Gender:</span> <span className="capitalize">{profile?.gender || '—'}</span></p>
            <p><span className="text-gray-500">Address:</span> {profile?.address || '—'}</p>
          </div>
        </div>

        {/* Card 2: Qualification & Employment */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">🎓 Qualification & Employment</h2>
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-500">Qualification:</span> <strong>{profile?.qualification}</strong></p>
            <p><span className="text-gray-500">Specialization:</span> {profile?.specialization || '—'}</p>
            <p><span className="text-gray-500">Experience:</span> {profile?.experience_years ?? 0} years</p>
            <p><span className="text-gray-500">Previous School:</span> {profile?.previous_school || '—'}</p>
            <p><span className="text-gray-500">Joining Date:</span> {profile?.joining_date ? new Date(profile.joining_date).toLocaleDateString('en-IN') : '—'}</p>

            <div className="bg-blue-50 p-3 rounded-lg mt-3">
              <p className="text-gray-400 text-xs">Monthly Salary</p>
              <p className="font-bold text-blue-700 text-lg">₹{profile?.salary || 0}</p>
            </div>
          </div>

          {/* Placeholder - jab class module ban jayega, yaha assigned classes ki list aayegi */}
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Assigned Classes</p>
            <p className="text-sm text-gray-400 italic">Class module abhi banna baaki hai.</p>
          </div>
        </div>

        {/* Card 3: Bank Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">🏦 Bank Details</h2>
          {profile?.bank_name || profile?.account_number ? (
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">Bank Name:</span> <strong>{profile?.bank_name || '—'}</strong></p>
              <p><span className="text-gray-500">Account Holder:</span> {profile?.account_holder_name || '—'}</p>
              <p><span className="text-gray-500">Account Number:</span> <span className="font-mono">{profile?.account_number || '—'}</span></p>
              <p><span className="text-gray-500">IFSC Code:</span> <span className="font-mono">{profile?.ifsc_code || '—'}</span></p>
              <p><span className="text-gray-500">Account Type:</span> <span className="capitalize">{profile?.account_type || '—'}</span></p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No bank details added yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherView;