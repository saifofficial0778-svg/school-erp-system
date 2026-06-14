import { useState } from 'react';

const AttendanceReport = () => {
    // 1. Core Attendance Report Data (Monthly Statistics)
    const [reportData] = useState([
        { id: 'S101', name: 'Aarav Sharma', class: '10th-A', totalClasses: 20, attendedClasses: 19 },
        { id: 'S102', name: 'Isha Patel', class: '12th-B', totalClasses: 20, attendedClasses: 12 },
        { id: 'S103', name: 'Kabir Verma', class: '10th-A', totalClasses: 20, attendedClasses: 16 },
        { id: 'S104', name: 'Diya Nair', class: '11th-A', totalClasses: 20, attendedClasses: 14 },
        { id: 'S105', name: 'Rahul Das', class: '12th-B', totalClasses: 20, attendedClasses: 20 },
        { id: 'S106', name: 'Amit Singh', class: '10th-A', totalClasses: 20, attendedClasses: 9 },
    ]);

    // 🛠️ CHUNK 1: Percentage Calculation Logic
    // Is function ka kaam hai student ki attendedClasses aur totalClasses lekar shuddh percentage nikalna.
    const calculatePercentage = (attended, total) => {
        if (total === 0) return 0;

        // 👇 BHAI, YAHAN APNA LOGIC LIKHO! (TASK 1)
        // Niyam: Percentage kaise nikalti hai? (attended / total) * 100
        // Hint: Math.round() use kar lena taaki decimal points (jaise 73.333) hat jayein aur saaf number mile.
        const attendancePercentage = Math.round((attended / total) * 100)

        return attendancePercentage; // Abhi ke liye zero return ho raha hai
    };

    return (
        <div className="space-y-6 p-4">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Monthly Attendance Insights</h1>
                <p className="text-sm text-gray-500">Analyze student consistency and flag low attendance defaulters</p>
            </div>

            {/* 📊 MAIN CONTENT: Report Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5">Roll No</th>
                                <th className="px-6 py-3.5">Student Name</th>
                                <th className="px-6 py-3.5">Class</th>
                                <th className="px-6 py-3.5">Total Classes</th>
                                <th className="px-6 py-3.5">Attended</th>
                                <th className="px-6 py-3.5 text-center">Attendance %</th>
                                <th className="px-6 py-3.5 text-center">Status Badge</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {reportData.map((student) => {
                                // Hamara math function yahan call ho raha hai
                                const percentage = calculatePercentage(student.attendedClasses, student.totalClasses);

                                // 👇 BHAI, YAHAN APNA LOGIC LIKHO! (TASK 2)
                                // Hame pata lagana hai ki kya percentage 75 se kam hai?
                                // Is 'isLowAttendance' variable ko aisi condition do jo true return kare agar percentage < 75 ho.
                                const isLowAttendance = percentage < 75;

                                return (
                                    <tr
                                        key={student.id}
                                        // 🚨 TASK 3: CONDITIONAL RED HIGHLIGHT ROW
                                        // Agar isLowAttendance true hai, toh is poorie row ka background light red (bg-rose-50/50) chamkana chahiye!
                                        className={`transition-colors ${isLowAttendance ? 'bg-rose-50/60 hover:bg-rose-100/50' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{student.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{student.class}</td>
                                        <td className="px-6 py-4 font-mono text-gray-600">{student.totalClasses}</td>
                                        <td className="px-6 py-4 font-mono text-emerald-600 font-medium">{student.attendedClasses}</td>

                                        {/* 6. Percentage Number Cell (Iska alignment center aur text clean kiya) */}
                                        <td className={`px-6 py-4 text-center font-mono font-bold text-base transition-colors ${isLowAttendance ? 'bg-rose-50/70 text-rose-600' : 'text-slate-800'}`}>
                                            {percentage}%
                                        </td>

                                        {/* 7. Status Badge Cell (🚨 ISKA UI FIXED KIYA - NO MORE CUTTING!) */}
                                        <td className={`px-6 py-4 text-center transition-colors ${isLowAttendance ? 'bg-rose-50/70' : ''}`}>
                                            <div className="flex justify-center items-center">
                                                {isLowAttendance ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wide whitespace-nowrap">
                                                        <span>🚨</span> Shortage
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                                                        <span>✓</span> Safe
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;