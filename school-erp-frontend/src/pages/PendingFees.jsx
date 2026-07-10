import React, { useState, useEffect } from 'react';
import API from '../services/api';

const PendingFee = () => {
    const [rawDetails, setRawDetails] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dropdown Status States
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const fetchFeeReportData = async () => {
        try {
            setLoading(true);
            const res = await API.get('/fees/report-page');
            if (res?.data?.success) {
                setRawDetails(res.data.data);
                setFilteredData(res.data.data); // Initial state
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to load fee dashboard:", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeReportData();
    }, []);

    // ✅ NEW: Class + Section combined label banane wala helper
    // "class_name" akela dikhane ke bajaye "class_name - Sec X" banata hai
    const getClassLabel = (item) =>
        item.class_name
            ? `${item.class_name}${item.section ? ' - Sec ' + item.section : ''}`
            : 'N/A';

    // 🔄 Dynamic Filter Logic (Jab bhi dropdown change hoga, yeh chalega)
    useEffect(() => {
        let data = [...rawDetails];

        // 1. Class wise filter — ✅ FIX: ab combined class+section label se compare hota hai
        if (selectedClass !== 'All') {
            data = data.filter(item => getClassLabel(item) === selectedClass);
        }

        // 2. Status wise filter (Paid, Pending, Overdue, Partially Paid)
        if (selectedStatus !== 'All') {
            if (selectedStatus === 'defaulters') {
                // Defaulter matlab jiska status pending, overdue, ya partial ho
                data = data.filter(item =>
                    item.status === 'pending' ||
                    item.status === 'overdue' ||
                    item.status === 'partial'
                );
            } else if (selectedStatus === 'partially_paid') {
                // ✅ FIX: backend 'partial' bhejta hai, dropdown 'partially_paid' hai — map kar diya
                data = data.filter(item => item.status === 'partial');
            } else {
                data = data.filter(item => item.status.toLowerCase() === selectedStatus.toLowerCase());
            }
        }

        setFilteredData(data);
    }, [selectedClass, selectedStatus, rawDetails]);

    // ✅ FIX: Unique Classes list ab class_name+section combo se banti hai (dropdown ke liye)
    const uniqueClasses = ['All', ...new Set(
        rawDetails.map(item => getClassLabel(item)).filter(label => label !== 'N/A')
    )];

    // ✅ NEW: Backend ke status codes ko friendly display text me map karta hai
    const statusLabelMap = {
        paid: 'PAID',
        partial: 'PARTIALLY PAID',
        pending: 'PENDING',
        overdue: 'OVERDUE'
    };

    return (
        <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen font-sans">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Fee Ledger & Defaulters Panel</h1>
                    <p className="text-xs text-gray-400">Track paid records, pending dues, and manage institution collections dynamic</p>
                </div>

                {/* 🎯 Dropdown Filters Feature Section */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Class Filter */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Filter Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="bg-white border border-gray-200 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Collection Status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-white border border-gray-200 text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="paid"> Fully Paid</option>
                            <option value="partially_paid">Partially Paid</option>
                            <option value="pending">Pending Logs</option>
                            <option value="overdue">Overdue Defaulters</option>
                            <option value="defaulters">All Defaulters Combine</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 📊 Main Table Layout */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="px-6 py-3.5">Admission / ID</th>
                                <th className="px-6 py-3.5">Student Name</th>
                                <th className="px-6 py-3.5">Assigned Class</th>
                                <th className="px-6 py-3.5">Total Demanded</th>
                                <th className="px-6 py-3.5">Amount Cleared</th>
                                <th className="px-6 py-3.5">Net Balance Due</th>
                                <th className="px-6 py-3.5 text-center">Status Badge</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 italic">
                                        Bhai live parameters calculate ho rhe hain... ⏳
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 italic">
                                        Is category me koi records nahi mile bhai! 🎯
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((student) => {
                                    // ✅ FIX: backend se aane wale sahi field names use kiye
                                    const totalBill = parseFloat(student.total_fee) || 0;
                                    const paid = parseFloat(student.total_paid) || 0;
                                    const balance = parseFloat(student.total_due) || 0;

                                    const statusKey = (student.status || 'pending').toLowerCase();
                                    const badgeText = statusLabelMap[statusKey] || student.status;

                                    // Dynamic Badge UI Logic
                                    let badgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                                    if (statusKey === 'paid') {
                                        badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                                    } else if (statusKey === 'overdue' || (balance > 0 && statusKey === 'pending')) {
                                        badgeStyle = "bg-rose-50 text-rose-700 border-rose-100";
                                    } else if (statusKey === 'partial') {
                                        badgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                                    }

                                    return (
                                        <tr key={student.student_id} className="hover:bg-slate-50/40 transition-all">
                                            <td className="px-6 py-4 font-mono text-gray-400">#{student.admission_number || student.student_id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{student.full_name}</td>
                                            <td className="px-6 py-4">
                                                {/* ✅ FIX: ab section bhi combined dikhega, e.g. "NC - Sec A" */}
                                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px]">
                                                    {getClassLabel(student)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-500">₹{totalBill.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-mono text-emerald-600">₹{paid.toLocaleString()}</td>
                                            <td className={`px-6 py-4 font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                                ₹{balance.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wide ${badgeStyle}`}>
                                                    {badgeText}
                                                </span>
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

export default PendingFee;