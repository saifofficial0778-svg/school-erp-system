import { useState } from 'react';

const PendingFees = () => {
  // 1. Core Students Fee Data (Hamara Dummy Database)
  const [feeRecords, setFeeRecords] = useState([
    { id: 1, rollNo: 'S101', name: 'Aarav Sharma', class: '10th-A', totalAmount: 10000, paidAmount: 10000, status: 'Paid', dueDate: '2026-06-05' },
    { id: 2, rollNo: 'S102', name: 'Isha Patel', class: '12th-B', totalAmount: 10000, paidAmount: 4500, status: 'Pending', dueDate: '2026-06-01' },
    { id: 3, rollNo: 'S103', name: 'Kabir Verma', class: '9th-C', totalAmount: 10000, paidAmount: 0, status: 'Pending', dueDate: '2026-05-20' },
    { id: 4, rollNo: 'S104', name: 'Diya Nair', class: '11th-A', totalAmount: 10000, paidAmount: 10000, status: 'Paid', dueDate: '2026-06-10' },
    { id: 5, rollNo: 'S105', name: 'Rahul Das', class: '10th-B', totalAmount: 10000, paidAmount: 7000, status: 'Pending', dueDate: '2026-06-15' },
  ]);

  // 2. Filter State: Kaunsa status select hai ('All', 'Paid', 'Pending')
  const [statusFilter, setStatusFilter] = useState('All ');

  // 🛠️ CHUNK 1: Overdue Dynamic Badge Logic
  // Is function ka kaam hai check karna ki student "Overdue" hai ya nahi.
  // Agar status 'Pending' hai AUR uski dueDate aaj ki date se pehle ki hai, toh hume use high-risk (Red Highlight) dikhana hai.
  const checkOverdueStatus = (dueDate, status) => {
    const today = new Date('2026-06-12'); // Maan lo aaj 2026-06-12 hai
    const recordDate = new Date(dueDate);

    // 👇 BHAI, YAHAN APNA LOGIC LIKHO! (TASK 1)
    // Niyam: Agar status 'Pending' hai aur recordDate choti hai (<) today se...
    // toh return karo true, nahi toh return karo false.
    if(status==="Pending" && recordDate<today){
        return true;
    }
    
    return false; // Abhi ke liye placeholder lagaya hai
  };


  // 🛠️ CHUNK 2: Filter Data Logic (.filter() ka khel)
  // Hume `feeRecords` array par filter chalana hai based on `statusFilter` state.
  const filteredRecords = feeRecords.filter((record) => {
    // 👇 BHAI, YAHAN APNA LOGIC LIKHO! (TASK 2)
    // 1. Agar statusFilter === 'All' hai, toh aankh band karke poora record return true kar do.
    // 2. Agar 'Paid' ya 'Pending' select hai, toh check karo ki kya record.status === statusFilter hai.
    if(statusFilter==='All'){
        return true
    }
    
    return record.status===statusFilter
  });


  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5 border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Defaulters & Fees Audit</h1>
          <p className="text-sm text-gray-500">Track pending balances and filter student dues</p>
        </div>

        {/* 🎛️ TOP FILTER BUTTONS */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit self-start md:self-auto">
          {['All', 'Paid', 'Pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab} Status
            </button>
          ))}
        </div>
      </div>

      {/* 📊 MAIN CONTENT: Fees List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5">Student Details</th>
                <th className="px-6 py-3.5">Total Fee</th>
                <th className="px-6 py-3.5">Paid Amount</th>
                <th className="px-6 py-3.5">Balance Due</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-center">Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredRecords.map((student) => {
                const isOverdue = checkOverdueStatus(student.dueDate, student.status);
                const balance = student.totalAmount - student.paidAmount;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{student.rollNo} | {student.class}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{student.totalAmount}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">₹{student.paidAmount}</td>
                    <td className="px-6 py-4 text-rose-600 font-semibold">₹{balance}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{student.dueDate}</td>
                    <td className="px-6 py-4 text-center">
                      {/* Dynamic Overdue Highlight Tag */}
                      {student.status === 'Paid' ? (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          ✓ Paid Clear
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                          ⚠️ OVERDUE CRITICAL
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                          ⏳ Pending Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400 text-sm">
                    No records found matching this filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingFees;