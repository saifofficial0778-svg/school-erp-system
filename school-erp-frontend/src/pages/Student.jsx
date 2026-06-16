import { useState, useEffect } from 'react';
// 📬 Hamare central postman functions ko import kar rahe hain
import { fetchStudents, collectStudentFee } from '../services/api';
// Note: Agar tumne api.js me naya student add karne ka function nahi banaya tha, toh hum yahin direct API instance se bhi call maar sakte hain!
import API from '../services/api';

const StudentsConnect = () => {
  const [students, setStudents] = useState([]); // Base state jo server se aaye bacho ko store karegi
  const [loading, setLoading] = useState(true); // Loading spinner chalane ke liye

  // Form input states (Naye student ke liye)
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('10th-A');
  const [rollNo, setRollNo] = useState('');

  // 🛠️ CHUNK 1: useEffect + GET Students List
  // Iska kaam hai jaise hi screen pehli baar load ho (Component Mount), turant server se data khinch ke lana.
// 🛠️ CHUNK 1: useEffect + GET Students List
  useEffect(() => {
    const loadStudentsData = async () => {
      try {
        setLoading(true);

        const res = await fetchStudents();
        console.log("Server se kya maal aaya bhai:", res); // Yeh console me pura structure dikha dega!

        // ✅ AGAR SERVER OBJECT BHEJ RAHA HAI (e.g., res.data ya res.students)
        if (res && Array.isArray(res)) {
          setStudents(res);
        } else if (res && res.data && Array.isArray(res.data)) {
          setStudents(res.data); // Agar backend '{ data: [...] }' bhej raha hai
        } else if (res && res.students && Array.isArray(res.students)) {
          setStudents(res.students); // Agar backend '{ students: [...] }' bhej raha hai
        } else {
          setStudents([]); // Kuch nahi mila toh khali array rakho taaki crash na ho
        }

        setLoading(false);
      } catch (error) {
        console.error("Data load nahi ho paya bhai:", error);
        setStudents([]); // Error aane par bhi khali array rakho taaki loop safe rahe
        setLoading(false);
      }
    };

    loadStudentsData();
  }, []);


  // 🛠️ CHUNK 2: Add Student ➡️ POST Call Logic
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rollNo) return alert("Saari fields bharo bhai!");

   try {
      // ✅ Exact wahi keys jo backend ka req.body expect kar raha hai:
      const newStudentPayload = {
        name: name,
        class: studentClass, // 👈 Key ka naam 'class' hi rakho, value variable 'studentClass' hoga!
        rollNo: Number(rollNo), // Safe side ke liye number format
      };

      console.log("Perfect synchronization payload:", newStudentPayload);

      // 1. Server par post request maari
      await API.post('/students', newStudentPayload);

      // 2. Local state update kari taaki table me turant live entry dikhe
      // Backend 'id' generator automatic handle kar raha hai (students.length + 1)
      // Toh hum frontend state me rollNo ko hi temporary key/id bana dete hain mapping ke liye
      setStudents((prev) => [
        ...(prev || []), 
        { id: rollNo, name: name, class: studentClass, rollNo: rollNo }
      ]);

      // 3. Form ke input boxes khali kar diye
      setName('');
      setRollNo('');

      alert("Bhai Mubarak Ho! Student added successfully! 🎉🔥");
    } catch (error) {
      console.error("Payload reject ho gaya bhai:", error);
      alert("Kuch gadbad hui, console check karo!");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Students Database Connect</h1>
        <p className="text-sm text-gray-500">Live synchronization with school backend server</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 📋 LEFT: ADD STUDENT FORM */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">✨ Add New Student</h2>
          <form onSubmit={handleAddStudentSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Roll Number / ID</label>
              <input
                type="text"
                placeholder="e.g. S107"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rohan Malhotra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Assign Class</label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="10th-A">10th-A</option>
                <option value="11th-A">11th-A</option>
                <option value="12th-B">12th-B</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm"
            >
              ➕ Register Student
            </button>
          </form>
        </div>

        {/* 📊 RIGHT: LIVE STUDENTS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-sm font-semibold text-gray-500 animate-pulse">
              🔄 Connecting to School API & Fetching Logs...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3.5">Roll No</th>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Assigned Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                        No students found on server database.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{student.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-blue-600 font-medium">{student.class}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentsConnect;