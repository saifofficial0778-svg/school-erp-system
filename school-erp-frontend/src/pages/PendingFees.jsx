import React, { useState, useEffect } from 'react';
import API from '../services/api';

const PendingFee = () => {
    const [rawDetails, setRawDetails] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const fetchFeeReportData = async () => {
        try {
            setLoading(true);
            const res = await API.get('/fees/report-page');
            if (res?.data?.success) {
                setRawDetails(res.data.data);
                setFilteredData(res.data.data);
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

    const getClassLabel = (item) =>
        item.class_name
            ? `${item.class_name}${item.section ? ' - Sec ' + item.section : ''}`
            : 'N/A';

    useEffect(() => {
        let data = [...rawDetails];

        if (selectedClass !== 'All') {
            data = data.filter(item => getClassLabel(item) === selectedClass);
        }

        if (selectedStatus !== 'All') {
            if (selectedStatus === 'defaulters') {
                data = data.filter(item =>
                    item.status === 'pending' ||
                    item.status === 'overdue' ||
                    item.status === 'partial'
                );
            } else if (selectedStatus === 'partially_paid') {
                data = data.filter(item => item.status === 'partial');
            } else {
                data = data.filter(item => item.status.toLowerCase() === selectedStatus.toLowerCase());
            }
        }

        setFilteredData(data);
    }, [selectedClass, selectedStatus, rawDetails]);

    const uniqueClasses = ['All', ...new Set(
        rawDetails.map(item => getClassLabel(item)).filter(label => label !== 'N/A')
    )];

    const statusLabelMap = {
        paid: 'PAID',
        partial: 'PARTIALLY PAID',
        pending: 'PENDING',
        overdue: 'OVERDUE'
    };

    // Ledger-wide stats
    const totalDemanded = filteredData.reduce((sum, r) => sum + (parseFloat(r.total_fee) || 0), 0);
    const totalCleared = filteredData.reduce((sum, r) => sum + (parseFloat(r.total_paid) || 0), 0);
    const defaulterCount = filteredData.filter(r => r.status !== 'paid').length;

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-rose-50/40 min-h-screen font-sans">

            {/* 🎯 HERO HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-amber-900 p-8 shadow-xl">
                <div className="absolute -top-16 -right-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-rose-200 text-[10px] font-bold uppercase tracking-widest mb-3">
                            Defaulters Panel
                        </span>
                        <h1 className="text-3xl font-black text-white tracking-tight">Fee Ledger & Defaulters</h1>
                        <p className="text-sm text-rose-200/80 mt-1.5">Track paid records, pending dues, and manage institution collections.</p>
                    </div>

                    {/* Filters moved into hero for prominence */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-rose-200 uppercase tracking-wider">Filter Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                            >
                                {uniqueClasses.map(cls => (
                                    <option key={cls} value={cls} className="text-slate-800">{cls === 'All' ? 'All Classes' : cls}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-rose-200 uppercase tracking-wider">Collection Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                            >
                                <option value="All" className="text-slate-800">All Statuses</option>
                                <option value="paid" className="text-slate-800">Fully Paid</option>
                                <option value="partially_paid" className="text-slate-800">Partially Paid</option>
                                <option value="pending" className="text-slate-800">Pending Logs</option>
                                <option value="overdue" className="text-slate-800">Overdue Defaulters</option>
                                <option value="defaulters" className="text-slate-800">All Defaulters Combine</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="relative grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                        <p className="text-[9px] font-bold text-rose-200 uppercase tracking-wider">Total Demanded</p>
                        <p className="text-xl font-black text-white font-mono mt-0.5">₹{totalDemanded.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                        <p className="text-[9px] font-bold text-rose-200 uppercase tracking-wider">Total Cleared</p>
                        <p className="text-xl font-black text-white font-mono mt-0.5">₹{totalCleared.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                        <p className="text-[9px] font-bold text-rose-200 uppercase tracking-wider">Defaulters</p>
                        <p className="text-xl font-black text-white font-mono mt-0.5">{defaulterCount}</p>
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
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="7" className="px-6 py-4">
                                            <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-gray-400 italic">
                                        Is category me koi records nahi mile bhai! 🎯
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((student) => {
                                    const totalBill = parseFloat(student.total_fee) || 0;
                                    const paid = parseFloat(student.total_paid) || 0;
                                    const balance = parseFloat(student.total_due) || 0;

                                    const statusKey = (student.status || 'pending').toLowerCase();
                                    const badgeText = statusLabelMap[statusKey] || student.status;

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