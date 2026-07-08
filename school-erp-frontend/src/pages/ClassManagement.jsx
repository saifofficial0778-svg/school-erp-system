import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ClassManagement = () => {
  const [classList, setClassList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Class Form State
  const [newClass, setNewClass] = useState({ class_name: '', section: '', teacher_id: '', monthly_fee: '' });

  // Assign Student Modal State
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [classStudents, setClassStudents] = useState([]);

  // Fetch Classes, Teachers, and Students
  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes, studentRes] = await Promise.all([
        API.get('/classes'),
        API.get('/teachers'),
        API.get('/students')
      ]);

      if (classRes.data?.data) setClassList(classRes.data.data);
      if (teacherRes.data?.data) setTeachers(teacherRes.data.data);
      if (studentRes.data?.data) setAllStudents(studentRes.data.data);
    } catch (err) {
      console.error("Classes load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Create Class
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/classes/add', newClass);
      alert(res.data.message);
      setNewClass({ class_name: '', section: '', teacher_id: '', monthly_fee: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating class");
    }
  };

  // 2. Open Class Modal & Fetch Enrolled Students
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

  // 3. Assign Student
  const handleAssignStudent = async () => {
    if (!selectedStudent) return alert("Select a student to assign!");
    try {
      const res = await API.post('/classes/assign-student', {
        student_id: selectedStudent,
        class_id: selectedClass.id,
        academic_year: '2026-2027'
      });
      alert(res.data.message);
      handleOpenAssignModal(selectedClass); // Refresh class student list
      fetchData(); // Refresh main count
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning student!");
    }
  };

  // Search Filter for Unassigned/All Students
  const filteredStudents = allStudents.filter(s => {
    const search = studentSearch.toLowerCase();
    const name = (s.fullName || s.full_name || '').toLowerCase();
    const adm = (s.admissionNumber || s.admission_number || '').toLowerCase();
    return name.includes(search) || adm.includes(search);
  });

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-900 tracking-tight">Class & Section Matrix</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage classes, assign teachers, allocate fees & map students.</p>
        </div>
      </div>

      {/* Grid: Create Class Form & Class List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Add Class Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-purple-900 border-b pb-2">＋ Create New Class</h2>
          
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class Name</label>
              <input 
                type="text" 
                placeholder="e.g. Class 10" 
                value={newClass.class_name} 
                onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })} 
                required 
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-600" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section</label>
              <input 
                type="text" 
                placeholder="e.g. A" 
                value={newClass.section} 
                onChange={(e) => setNewClass({ ...newClass, section: e.target.value })} 
                required 
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-600" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign Class Teacher</label>
              <select 
                value={newClass.teacher_id} 
                onChange={(e) => setNewClass({ ...newClass, teacher_id: e.target.value })} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-600"
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.full_name || t.fullName} ({t.specialization || 'Teacher'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Tuition Fee (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 2500" 
                value={newClass.monthly_fee} 
                onChange={(e) => setNewClass({ ...newClass, monthly_fee: e.target.value })} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-600" 
              />
            </div>

            <button type="submit" className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-md transition-all">
              Save Class Record
            </button>
          </form>
        </div>

        {/* 2. Class Cards Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-purple-900">Active Classes ({classList.length})</h2>

          {loading ? (
            <div className="p-8 text-center text-gray-400 font-semibold">Loading Class Matrix...</div>
          ) : classList.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center text-gray-400 border">No classes created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classList.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900">{c.class_name} <span className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Sec {c.section}</span></h3>
                      <p className="text-xs text-gray-500 mt-1">🧑‍🏫 {c.teacher_name || 'No Teacher Assigned'}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-mono">
                      ₹{c.monthly_fee || 0}/mo
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs font-semibold text-gray-500">
                    <span>Enrolled: <strong className="text-purple-700">{c.total_students || 0} Students</strong></span>
                    <button 
                      onClick={() => handleOpenAssignModal(c)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg transition-all"
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
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-purple-900">Manage {selectedClass.class_name} - Section {selectedClass.section}</h3>
                <p className="text-xs text-gray-500">Search student by name or admission no. to assign into this section.</p>
              </div>
              <button onClick={() => setSelectedClass(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            </div>

            {/* Student Search & Select Bar */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
              <input 
                type="text" 
                placeholder="🔍 Search student name or admission number..." 
                value={studentSearch} 
                onChange={(e) => setStudentSearch(e.target.value)} 
                className="w-full px-4 py-2 bg-white border rounded-lg text-sm outline-none focus:border-purple-600" 
              />

              <div className="flex gap-2">
                <select 
                  value={selectedStudent} 
                  onChange={(e) => setSelectedStudent(e.target.value)} 
                  className="flex-1 px-4 py-2 bg-white border rounded-lg text-sm outline-none"
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
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Enrolled Students List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-400">Currently Enrolled ({classStudents.length})</h4>
              <div className="max-h-56 overflow-y-auto divide-y border rounded-xl">
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