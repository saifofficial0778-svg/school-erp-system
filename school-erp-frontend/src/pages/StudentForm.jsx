import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',           // ✅ Email field add kiya
  admissionNumber: '',
  rollNumber: '',
  whatsAppNumber: '',
  dateOfBirth: '',
  gender: 'male',
  guardianName: '',
};

const NAME_REGEX = /^[A-Za-z\s.'-]{2,50}$/;
const ADMISSION_REGEX = /^[A-Za-z0-9\-/]{3,20}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = (form) => {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = 'First name required hai.';
  else if (!NAME_REGEX.test(form.firstName.trim())) errors.firstName = 'Sirf letters allowed (2-50 chars).';

  if (form.lastName && !NAME_REGEX.test(form.lastName.trim())) errors.lastName = 'Sirf letters allowed.';

  // ✅ Email validation
  if (!form.email.trim()) errors.email = 'Email required hai.';
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'Valid email address do.';

  if (!form.admissionNumber.trim()) errors.admissionNumber = 'Admission number required hai.';
  else if (!ADMISSION_REGEX.test(form.admissionNumber.trim())) errors.admissionNumber = 'Sirf letters, numbers, - / allowed (3-20 chars).';

  if (!form.rollNumber) errors.rollNumber = 'Roll number required hai.';
  else if (!/^\d+$/.test(form.rollNumber) || Number(form.rollNumber) <= 0 || Number(form.rollNumber) > 9999)
    errors.rollNumber = 'Valid positive number do (1-9999).';

  if (form.whatsAppNumber && !MOBILE_REGEX.test(form.whatsAppNumber.trim()))
    errors.whatsAppNumber = '10-digit valid mobile number do (6-9 se start).';

  if (form.dateOfBirth) {
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
    if (dob > today) errors.dateOfBirth = 'DOB future me nahi ho sakti.';
    else if (age < 2 || age > 25) errors.dateOfBirth = 'Age 2-25 saal ke beech honi chahiye.';
  }

  if (!['male', 'female', 'other'].includes(form.gender)) errors.gender = 'Valid gender select karo.';
  if (form.guardianName && !NAME_REGEX.test(form.guardianName.trim())) errors.guardianName = 'Sirf letters allowed.';

  return errors;
};

// ✅ Credentials Modal Component
const CredentialsModal = ({ credentials, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Login Credentials\nEmail: ${credentials.email}\nPassword: ${credentials.password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-4xl">🎉</div>
          <h2 className="text-lg font-bold text-gray-800">Student Enrolled Successfully!</h2>
          <p className="text-xs text-gray-500">Yeh credentials student ko share karo. Password sirf abhi dikhega.</p>
        </div>

        {/* Credentials Box */}
        <div className="bg-slate-50 border border-purple-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Email (Login ID)</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm text-gray-800 break-all">
            📧 {credentials.email}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Password</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm text-purple-700 font-bold tracking-widest">
            🔑 {credentials.password}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex gap-2 items-start">
          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-amber-700 font-medium">
            Yeh password dobara nahi dikhega. Abhi copy karke save kar lo ya student ko bhej do.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm py-2.5 rounded-xl transition-all"
          >
            {copied ? '✅ Copied!' : '📋 Copy Credentials'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-sm py-2.5 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null); // ✅ Modal state
  const schoolId = '1';

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ Sirf email bhejo — password backend generate karega
    const payload = {
      schoolId: parseInt(schoolId),
      email: form.email.trim(),
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      admissionNumber: form.admissionNumber.trim(),
      rollNumber: parseInt(form.rollNumber),
      whatsAppNumber: form.whatsAppNumber.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender,
      guardianName: form.guardianName.trim() || null,
    };

    try {
      setLoading(true);
      const res = await API.post('/students', payload);
      
      // ✅ Credentials modal dikhao
      if (res.data?.credentials) {
        setCredentials(res.data.credentials);
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert(error.response?.data?.message || 'Kuch gadbad ho gayi, dobara try karo.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setCredentials(null);
    navigate('/student'); // modal band hone ke baad list pe jao
  };

  const inputClass = (field) =>
    `w-full bg-slate-50/60 border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-gray-700 ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'
    }`;

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* ✅ Credentials Modal */}
      {credentials && (
        <CredentialsModal credentials={credentials} onClose={handleModalClose} />
      )}

      {/* Header */}
      <div className="bg-purple-900 px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate('/student')} className="text-white text-xl">←</button>
        <h1 className="text-xl font-bold text-white tracking-tight">Student Enrollment</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            <div className="flex items-start gap-3">
              <div className="bg-purple-50 text-purple-700 rounded-full w-9 h-9 flex items-center justify-center text-lg shrink-0">👤</div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Student Admission</h2>
                <p className="text-xs text-gray-500 mt-0.5">Fill in the required details. A login account will be created automatically.</p>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <div className="border-l-4 border-purple-700 pl-3">
                <h3 className="text-sm font-bold text-gray-800">Personal Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">First Name *</label>
                  <input type="text" placeholder="Enter first name" value={form.firstName}
                    onChange={handleChange('firstName')} className={inputClass('firstName')} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Last Name</label>
                  <input type="text" placeholder="Enter last name" value={form.lastName}
                    onChange={handleChange('lastName')} className={inputClass('lastName')} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>

                {/* ✅ Email Field - naya add kiya */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Student Email * <span className="text-purple-600">(Login ID banega)</span></label>
                  <input type="email" placeholder="e.g. student@gmail.com" value={form.email}
                    onChange={handleChange('email')} className={inputClass('email')} />
                  {errors.email
                    ? <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    : <p className="text-xs text-gray-400 mt-1">Isi email se student portal login karega.</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Admission Number *</label>
                  <input type="text" placeholder="e.g. ADM-2026-001" value={form.admissionNumber}
                    onChange={handleChange('admissionNumber')} className={inputClass('admissionNumber')} />
                  {errors.admissionNumber
                    ? <p className="text-xs text-red-500 mt-1">{errors.admissionNumber}</p>
                    : <p className="text-xs text-gray-400 mt-1">Letters, numbers, - / allowed.</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Roll Number *</label>
                  <input type="number" placeholder="e.g. 101" value={form.rollNumber}
                    onChange={handleChange('rollNumber')} className={inputClass('rollNumber')} />
                  {errors.rollNumber && <p className="text-xs text-red-500 mt-1">{errors.rollNumber}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">WhatsApp Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span>
                    <input type="text" placeholder="10-digit mobile number" value={form.whatsAppNumber}
                      onChange={handleChange('whatsAppNumber')} className={`${inputClass('whatsAppNumber')} pl-9`} />
                  </div>
                  {errors.whatsAppNumber
                    ? <p className="text-xs text-red-500 mt-1">{errors.whatsAppNumber}</p>
                    : <p className="text-xs text-gray-400 mt-1">Used for WhatsApp alerts (fees, attendance & results).</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth}
                    onChange={handleChange('dateOfBirth')} className={inputClass('dateOfBirth')} />
                  {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Gender *</label>
                  <select value={form.gender} onChange={handleChange('gender')} className={inputClass('gender')}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Guardian */}
            <div className="space-y-4">
              <div className="border-l-4 border-purple-700 pl-3">
                <h3 className="text-sm font-bold text-gray-800">Guardian / Parent <span className="text-gray-400 font-normal">(Optional)</span></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Guardian Name</label>
                  <input type="text" placeholder="Enter father or mother name" value={form.guardianName}
                    onChange={handleChange('guardianName')} className={inputClass('guardianName')} />
                  {errors.guardianName && <p className="text-xs text-red-500 mt-1">{errors.guardianName}</p>}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <span>{loading ? '⌛ Enrolling Student...' : '👤 Enroll Student'}</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;