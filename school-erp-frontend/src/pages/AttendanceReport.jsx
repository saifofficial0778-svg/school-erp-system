import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AttendanceReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [schoolId] = useState('1');

    // 🔄 Live aggregate database engine data streaming pull
    const fetchLiveReportData = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/attendance/report?schoolId=${schoolId}`);
            if (res?.data?.success) {
                setReportData(res.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Network dashboard link failed to fetch parameters:", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveReportData();
    }, [schoolId]);

    // 🛠️ Percentage Calculation Logic (Airtight Format conversion)
    const calculatePercentage = (attended, total) => {
        const totalNum = parseInt(total) || 0;
        const attendedNum = parseInt(attended) || 0;
        
        if (totalNum === 0) return 0;
        return Math.round((attendedNum / totalNum) * 100);
    };

    return (
        <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen font-sans">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Monthly Attendance Insights</h1>
                <p className="text-xs text-gray-400">Analyze student consistency and flag low attendance defaulters live</p>
            </div>

            {/* 📊 MAIN CONTENT: Report Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5">System ID / Admission</th>
                                <th className="px-6 py-3.5">Student Name</th>
                                <th className="px-6 py-3.5">Total Sessions Marked</th>
                                <th className="px-6 py-3.5">Attended Classes</th>
                                <th className="px-6 py-3.5 text-center">Attendance %</th>
                                <th className="px-6 py-3.5 text-center">Status Badge</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                        Bhai backend se logs compile ho rhe hain, ek second... ⏳
                                    </td>
                                </tr>
                            ) : reportData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                        Database registry me koi rows nahi mili bhai!
                                    </td>
                                </tr>
                            ) : (
                                reportData.map((student) => {
                                    const percentage = calculatePercentage(student.attended_classes, student.total_classes);
                                    const isLowAttendance = percentage < 75 && parseInt(student.total_classes) > 0;

                                    return (
                                        <tr
                                            key={student.student_id}
                                            className={`transition-all ${isLowAttendance ? 'bg-rose-50/40 hover:bg-rose-100/30' : 'hover:bg-slate-50/30'}`}
                                        >
                                            <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                                                #{student.admission_number || student.student_id}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{student.full_name}</td>
                                            <td className="px-6 py-4 font-mono text-gray-500">{student.total_classes}</td>
                                            <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{student.attended_classes}</td>

                                            <td className={`px-6 py-4 text-center font-mono font-black text-sm ${isLowAttendance ? 'text-rose-600' : 'text-slate-800'}`}>
                                                {percentage}%
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    {isLowAttendance ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black rounded-full bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wide">
                                                            🚨 Shortage
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
                                                            ✓ Safe
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;