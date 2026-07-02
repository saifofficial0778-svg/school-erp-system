import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const StudentView = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [data, setData] = useState({ profile: null, fees: [], attendance: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await API.get(`/student/${studentId}/profile-view`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard data load fail:", err);
      } {
        setLoading(false);
      }
    };
    if (studentId) fetchFullData();
  }, [studentId]);

  if (loading) return <div className="p-10 text-center text-gray-500">🔄 Loading Student Dashboard Records...</div>;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <button onClick={() => navigate('/student')} className="text-xl font-bold bg-white p-2 rounded-lg shadow-sm border">← Back</button>
        <h1 className="text-2xl font-bold text-slate-800">Student 360° Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">👤 Personal Details</h2>
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-500">Full Name:</span> <strong>{data.profile?.full_name}</strong></p>
            <p><span className="text-gray-500">Email:</span> {data.profile?.email}</p>
            <p><span className="text-gray-500">Admission No:</span> {data.profile?.admission_number}</p>
            <p><span className="text-gray-500">Roll No:</span> {data.profile?.roll_number}</p>
            <p><span className="text-gray-500">WhatsApp:</span> {data.profile?.whats_app_number || '—'}</p>
            <p><span className="text-gray-500">Guardian Name:</span> {data.profile?.guardian_name}</p>
            <p><span className="text-gray-500">Gender:</span> <span className="capitalize">{data.profile?.gender}</span></p>
          </div>
        </div>

        {/* Card 2: Fee History (Updated Columns) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">💰 Fee Status</h2>
          {data.fees.length === 0 ? <p className="text-sm text-gray-400">No fee record found.</p> : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {data.fees.map((fee) => (
                <div key={fee.id} className="border-b pb-2 text-sm flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{fee.month} / {fee.year}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${fee.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {fee.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 text-xs text-gray-500">
                    <div>Total: ₹{fee.total_amount}</div>
                    <div>Paid: ₹{fee.paid_amount}</div>
                    <div className="text-red-500 font-medium">Due: ₹{fee.due_amount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Attendance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">📅 Attendance History</h2>
          {data.attendance.length === 0 ? <p className="text-sm text-gray-400">No attendance logged yet.</p> : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {data.attendance.map((att, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2 text-sm">
                  <div>
                    <span className="text-gray-700">{new Date(att.date).toLocaleDateString('en-IN')}</span>
                    {att.remarks && <p className="text-xs text-gray-400 italic">{att.remarks}</p>}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${att.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {att.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentView;