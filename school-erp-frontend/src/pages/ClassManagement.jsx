import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ClassManagement = () => {
    const [classList, setClassList] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newClass, setNewClass] = useState({ class_name: '', section: '', teacher_id: '', monthly_fee: '' });

    const [selectedClass, setSelectedClass] = useState(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [classStudents, setClassStudents] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [metaRes, studentRes] = await Promise.all([
                API.get('/classes/meta-data'),
                API.get('/students')
            ]);

            if (metaRes.data?.success) {
                setClassList(metaRes.data.classes || []);
                setTeachers(metaRes.data.teachers || []);
            }

            const studentsData = studentRes.data?.data || studentRes.data || [];
            setAllStudents(studentsData);
        } catch (err) {
            console.error("Classes mapping logs fetch fail:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/classes/create', newClass);
            alert(res.data.message);
            setNewClass({ class_name: '', section: '', teacher_id: '', monthly_fee: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error creating class");
        }
    };

    const handleOpenAssignModal = async (cls) => {
        setSelectedClass(cls);
        setSelectedStudent('');
        setStudentSearch('');
        try {
            const res = await API.get(`/classes/${cls.id}/students`);
            if (res.data?.data) setClassStudents(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignStudent = async () => {
        if (!selectedStudent) return alert("Select a student to assign!");
        try {
            const res = await API.post('/classes/assign-student', {
                student_id: selectedStudent,
                class_id: selectedClass.id,
                academic_year: '2026-2027'
            });
            alert(res.data.message);
            handleOpenAssignModal(selectedClass);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error assigning student!");
        }
    };

    const filteredStudents = allStudents.filter(s => {
        const search = studentSearch.toLowerCase();
        const name = (s.fullName || s.full_name || '').toLowerCase();
        const adm = (s.admissionNumber || s.admission_number || '').toLowerCase();
        return name.includes(search) || adm.includes(search);
    });

    // Directory-wide stats
    const totalEnrolled = classList.reduce((sum, c) => sum + (parseInt(c.total_students) || 0), 0);
    const assignedTeacherCount = new Set(classList.map(c => c.teacher_id).filter(Boolean)).size;

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-cyan-50/40 min-h-screen font-sans">

            {/* 🎯 HERO HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-cyan-900 p-8 shadow-xl">
                <div className="absolute -top-16 -right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl"></div>

                <div className="relative">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-[10px] font-bold uppercase tracking-widest mb-3">
                        Academic Structure
                    </span>
                    <h1 className="text-3xl font-black text-white tracking-tight">Class & Section Matrix</h1>
                    <p className="text-sm text-cyan-200/80 mt-1.5">Manage classes, assign teachers, allocate fees & map students.</p>
                </div>

                <div className="relative grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                        <p className="text-[9px] font-bold text-cyan-200 uppercase tracking-wider">Active Classes</p>
                        <p className="text-2xl font-black text-white font-mono mt-0.5">{classList.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                        <p className="text-[9px] font-bold text-cyan-200 uppercase tracking-wider">Total Enrolled</p>
                        <p className="text-2xl font-black text-white font-mono mt-0.5">{totalEnrolled}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                        <p className="text-[9px] font-bold text-cyan-200 uppercase tracking-wider">Teachers Assigned</p>
                        <p className="text-2xl font-black text-white font-mono mt-0.5">{assignedTeacherCount}</p>
                    </div>
                </div>
            </div>

            {/* Grid: Create Class Form & Class List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Add Class Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit">
                    <h2 className="text-sm font-bold text-slate-800 border-b border-gray-100 pb-3 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">＋</span>
                        Create New Class
                    </h2>

                    <form onSubmit={handleCreateClass} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Class Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Class 10"
                                value={newClass.class_name}
                                onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Section</label>
                            <input
                                type="text"
                                placeholder="e.g. A"
                                value={newClass.section}
                                onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Assign Class Teacher</label>
                            <select
                                value={newClass.teacher_id}
                                onChange={(e) => setNewClass({ ...newClass, teacher_id: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                            >
                                <option value="">-- Select Teacher --</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.full_name || t.fullName} ({t.specialization || 'Teacher'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Monthly Tuition Fee (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 2500"
                                value={newClass.monthly_fee}
                                onChange={(e) => setNewClass({ ...newClass, monthly_fee: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                            />
                        </div>

                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition-all">
                            Save Class Record
                        </button>
                    </form>
                </div>

                {/* 2. Class Cards Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-sm font-bold text-slate-800">Active Classes ({classList.length})</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
                                    <div className="h-5 w-32 bg-slate-100 rounded mb-2"></div>
                                    <div className="h-3 w-24 bg-slate-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : classList.length === 0 ? (
                        <div className="p-16 bg-white rounded-2xl text-center text-gray-400 border border-gray-100">
                            <span className="text-4xl">🏫</span>
                            <p className="font-medium text-sm mt-3">No classes created yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classList.map((c) => (
                                <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-200 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800">{c.class_name} <span className="text-xs font-bold font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">Sec {c.section}</span></h3>
                                            <p className="text-xs text-gray-500 mt-1.5">🧑‍🏫 {c.teacher_name || 'No Teacher Assigned'}</p>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-mono">
                                            ₹{c.monthly_fee || c.assigned_monthly_fee || 0}/mo
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs font-semibold text-gray-500">
                                        <span>Enrolled: <strong className="text-teal-700">{c.total_students || 0} Students</strong></span>
                                        <button
                                            onClick={() => handleOpenAssignModal(c)}
                                            className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            Manage Students →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* 3. ASSIGN STUDENT MODAL */}
            {selectedClass && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 space-y-5">

                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Manage {selectedClass.class_name} - Section {selectedClass.section}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Search student by name or admission no. to assign into this section.</p>
                            </div>
                            <button onClick={() => setSelectedClass(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                        </div>

                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                            <input
                                type="text"
                                placeholder="🔍 Search student name or admission number..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                            />

                            <div className="flex gap-2">
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">-- Choose Student to Assign --</option>
                                    {filteredStudents.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.fullName || s.full_name} (Adm: {s.admissionNumber || s.admission_number || 'N/A'})
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleAssignStudent}
                                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Currently Enrolled ({classStudents.length})</h4>
                            <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl">
                                {classStudents.length === 0 ? (
                                    <p className="p-4 text-center text-xs text-gray-400">No students mapped to this class yet.</p>
                                ) : (
                                    classStudents.map((st) => (
                                        <div key={st.id} className="p-3 flex justify-between items-center text-xs hover:bg-slate-50">
                                            <div>
                                                <p className="font-bold text-gray-800">{st.full_name}</p>
                                                <p className="text-gray-400 font-mono">Adm No: {st.admission_number} | Roll: {st.roll_number || 'N/A'}</p>
                                            </div>
                                            <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full uppercase text-[10px]">Active</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ClassManagement;