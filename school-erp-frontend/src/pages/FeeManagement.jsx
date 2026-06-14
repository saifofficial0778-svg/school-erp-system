import { useState } from 'react';

const FeeManagement = () => {
    // 1. Students Fee Data (Memory Box)
    const [feeRecords, setFeeRecords] = useState([
        { id: 1, name: 'Aarav Sharma', rollNo: '2026A01', class: '10th-A', amount: '₹5,000', status: 'Paid', date: '2026-06-01' },
        { id: 2, name: 'Isha Patel', rollNo: '2026A02', class: '12th-B', amount: '₹5,000', status: 'Pending', date: '-' },
        { id: 3, name: 'Kabir Verma', rollNo: '2026A03', class: '9th-C', amount: '₹4,500', status: 'Processing', date: '2026-06-05' },
        { id: 4, name: 'Diya Nair', rollNo: '2026A04', class: '11th-A', amount: '₹5,500', status: 'Paid', date: '2026-05-28' },
        { id: 5, name: 'Vivaan Joshi', rollNo: '2026A05', class: '10th-B', amount: '₹5,000', status: 'Pending', date: '-' },
    ]);

    // 2. Search Text State
    const [searchTerm, setSearchTerm] = useState('');

    // 3. Dropdown Filter State (All, Paid, Pending, Processing)
    const [statusFilter, setStatusFilter] = useState('All');

    // 4. [LOGIC]: Search + Dropdown Filter Combo
    const filteredRecords = feeRecords.filter((record) => {
        const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.rollNo.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'All' || record.status === statusFilter

        return matchesSearch && matchesStatus
    });

    // 5. [LOGIC]: Status Badges Color Assigner Function
    const getStatusBadge = (status) => {
        if (status === 'Paid') {
            return 'bg-green-50 text-green-700 border-green-200';
        } else if (status === 'Pending') {
            return 'bg-red-50 text-red-700 border-red-200';
        } else {
            return 'bg-amber-50 text-amber-700 border-amber-200'; // Processing ke liye yellow/amber
        }
    };

    // 6. [LOGIC]: Instant Status Toggle (Backend style update)
    const toggleFeeStatus = (id) => {
        const updatedRecords = feeRecords.map((record) => {
            if (record.id === id) {
                // Agar Paid hai toh Pending kar do, Pending hai toh Processing, aur Processing hai toh Paid!
                const nextStatus = record.status === 'Paid' ? 'Pending' : record.status === 'Pending' ? 'Processing' : 'Paid';
                const nextDate = nextStatus === 'Paid' ? '2026-06-06' : '-';
                return { ...record, status: nextStatus, date: nextDate };
            }
            return record;
        });
        setFeeRecords(updatedRecords);
    };

    return (
        <div className="space-y-6">
            {/* Top Title Bar */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>
                    <p className="text-sm text-gray-500">Track and manage student tuition fees</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 text-sm font-semibold">
                    Total Records: {filteredRecords.length}
                </div>
            </div>

            {/* 🛠️ CHUNK 1: Filters Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {/* Search Bar */}
                <div className="w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search student or roll no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* Dropdown Filter */}
                <div className="w-full sm:w-auto flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid Only</option>
                        <option value="Pending">Pending Only</option>
                        <option value="Processing">Processing Only</option>
                    </select>
                </div>
            </div>

            {/* 📊 CHUNK 2: Fee Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Roll No</th>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Fee Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment Date</th>
                                <th className="px-6 py-4 text-center">Quick Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-600">{record.rollNo}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{record.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{record.class}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{record.amount}</td>

                                        {/* Dynamic Status Badges */}
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold border rounded-md shadow-sm ${getStatusBadge(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{record.date}</td>

                                        {/* Toggle Button Action */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleFeeStatus(record.id)}
                                                className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-md font-medium border border-slate-200 hover:border-blue-200 transition-all shadow-sm"
                                            >
                                                🔄 Change Status
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-400 italic">No matching fee records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeManagement;