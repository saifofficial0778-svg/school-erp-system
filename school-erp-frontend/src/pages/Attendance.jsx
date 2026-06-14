import { useState } from 'react';

const Attendance = () => {
  // 1. Master Database State
  const [studentsData, setStudentsData] = useState([
    { id: 'S101', name: 'Aarav Sharma', class: '10th-A', status: 'Present' },
    { id: 'S102', name: 'Isha Patel', class: '12th-B', status: 'Present' },
    { id: 'S103', name: 'Kabir Verma', class: '10th-A', status: 'Absent' },
    { id: 'S104', name: 'Diya Nair', class: '11th-A', status: 'Present' },
    { id: 'S105', name: 'Rahul Das', class: '12th-B', status: 'Absent' },
    { id: 'S106', name: 'Amit Singh', class: '10th-A', status: 'Present' },
  ]);

  const [selectedClass, setSelectedClass] = useState('10th-A');
  
  // 📅 NEW STATE: Target Date track karne ke liye (Default: Aaj ki date)
  const [attendanceDate, setAttendanceDate] = useState('2026-06-13');

  // 🔔 NEW STATE: Success Toast/Alert ko show/hide karne ke liye
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 🔄 Purana Filter Logic (Jo tumne ekdum sahi banaya tha!)
  const filteredStudents = studentsData.filter((student) => {
    return student.class === selectedClass;
  });

  // 🔄 Purana Toggle Logic (Jo tumne makkhan chalaya tha!)
  const handleStatusToggle = (studentId, newStatus) => {
    const updatedStatus = studentsData.map((student) => {
      if (student.id === studentId) {
        return { ...student, status: newStatus };
      }
      return student;
    });
    setStudentsData(updatedStatus);
  };


  // 🛠️ CHUNK 1: Master Submit Form Logic (`handleSubmitAttendance`)
  // Iska kaam hai poori class ki attendance ko final state me convert karna aur success alert dikhana.
  const handleSubmitAttendance = (e) => {
    e.preventDefault(); // Form reload hone se bachane ke liye
    const message=`Success! class ${selectedClass} attendance for ${attendanceDate} has been saved`;
    setToastMessage(message)
    setShowToast(true);
    setTimeout(() => {
        setShowToast(false)
    }, 3000);
    

  };

  return (
    <div className="space-y-6 p-4 relative">
      
      {/* 🔔 SUCCESS TOAST ALERT POP-UP */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-3 animate-bounce">
          <span className="text-lg">🎉</span>
          <div className="text-xs font-semibold">{toastMessage}</div>
          <button onClick={() => setShowToast(false)} className="text-emerald-200 hover:text-white ml-2 font-bold">×</button>
        </div>
      )}

      {/* Main Submission Form Wrapper */}
      <form onSubmit={handleSubmitAttendance} className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5 border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daily Attendance Tracker</h1>
            <p className="text-sm text-gray-500">Select class, date and submit final logs</p>
          </div>

          {/* 🎛️ CONTROLS BAR: Dropdown + Date Picker */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* 🏫 CLASS DROPDOWN */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-sm font-semibold text-blue-600 focus:outline-none cursor-pointer"
              >
                <option value="10th-A">10th-A</option>
                <option value="11th-A">11th-A</option>
                <option value="12th-B">12th-B</option>
              </select>
            </div>

            {/* 📅 DATE PICKER */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase">Date:</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 📊 STUDENT ATTENDANCE TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3.5">Roll No</th>
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5">Class</th>
                  <th className="px-6 py-3.5">Current Status</th>
                  <th className="px-6 py-3.5 text-center">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{student.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.class}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {student.status === 'Present' ? '● Present' : '○ Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                        <button
                          type="button" // Form submit hone se rokne ke liye mandatory type
                          onClick={() => handleStatusToggle(student.id, 'Present')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            student.status === 'Present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(student.id, 'Absent')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                            student.status === 'Absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 💾 MASTER SAVE BUTTON FOOTER */}
          <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              📥 Save Full Attendance Sheet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Attendance;