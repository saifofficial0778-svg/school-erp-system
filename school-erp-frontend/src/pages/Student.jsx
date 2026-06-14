import { useState } from 'react';

const Student = () => {
  // 1. Students Main Data State
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Sharma', rollNo: '2026A01', class: '10th-A', phone: '9876543210' },
    { id: 2, name: 'Isha Patel', rollNo: '2026A02', class: '12th-B', phone: '8765432109' },
    { id: 3, name: 'Kabir Verma', rollNo: '2026A03', class: '9th-C', phone: '7654321098' },
    { id: 4, name: 'Diya Nair', rollNo: '2026A04', class: '11th-A', phone: '6543210987' },
    { id: 5, name: 'Vivaan Joshi', rollNo: '2026A05', class: '10th-B', phone: '9123456789' },
  ]);

  // 2. Search Text State
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Modals Status States (Kholne aur band karne ke liye)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 4. Forms Data States (Dabbe)
  const [formData, setFormData] = useState({ name: '', class: '', phone: '' });
  const [editingStudentId, setEditingStudentId] = useState(null); // Kisko edit kar rahe hain, uski ID track karne ke liye

  // 5. Search Filter Logic
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 6. [ADD LOGIC]: Naya Student Add karne ka Function
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      id: Date.now(),
      name: formData.name,
      rollNo: `2026A0${students.length + 1}`,
      class: formData.class,
      phone: formData.phone
    };
    setStudents([...students, newStudent]);
    setFormData({ name: '', class: '', phone: '' });
    setIsAddModalOpen(false);
  };

  // 7. [DELETE LOGIC]: Student Delete karne ka Function
  const handleDeleteStudent = (id) => {
    // Array filter ka use karke us ID wale student ko bahar nikal denge
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  // 8. [EDIT STEP 1]: Edit button click hone par Form me purana data bharna
  const openEditModal = (student) => {
    setEditingStudentId(student.id); // ID save kar li
    setFormData({
      name: student.name,
      class: student.class,
      phone: student.phone
    }); // Form me purana data bhar diya
    setIsEditModalOpen(true); // Modal khol diya
  };

  // 9. [EDIT STEP 2]: Form submit karne par Data Update karna
  const handleEditStudent = (e) => {
    e.preventDefault();
    // `.map()` ka use karke sirf us id wale student ka data badlenge, baaki same rahenge
    const updatedStudents = students.map((student) =>
      student.id === editingStudentId 
        ? { ...student, name: formData.name, class: formData.class, phone: formData.phone }
        : student
    );
    setStudents(updatedStudents);
    setFormData({ name: '', class: '', phone: '' });
    setIsEditModalOpen(false);
    setEditingStudentId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Students Management</h1>
        <p className="text-sm text-gray-500">Total Registered: {students.length}</p>
      </div>

      {/* Search & Add Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button 
          onClick={() => {
            setFormData({ name: '', class: '', phone: '' }); // Khali form
            setIsAddModalOpen(true);
          }} 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          + Add New Student
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-600">{student.rollNo}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md">{student.class}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{student.phone}</td>
                    
                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openEditModal(student)} // Edit call
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)} // Delete call
                        className="text-red-500 hover:text-red-700 font-medium text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No matching students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📋 POP-UP 1: ADD STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <input
                  type="text" required value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g. 10th-B"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 POP-UP 2: EDIT STUDENT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Update Student Details</h2>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <input
                  type="text" required value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingStudentId(null); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">Update Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;