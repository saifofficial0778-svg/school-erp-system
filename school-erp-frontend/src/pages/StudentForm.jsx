import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const initialForm = {
  firstName: '',
  lastName: '',
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

const validateForm = (form) => {
  const errors = {};

  if (!form.firstName.trim()) {
    errors.firstName = 'First name required hai.';
  } else if (!NAME_REGEX.test(form.firstName.trim())) {
    errors.firstName = 'Sirf letters allowed (2-50 characters).';
  }

  if (form.lastName && !NAME_REGEX.test(form.lastName.trim())) {
    errors.lastName = 'Sirf letters allowed.';
  }

  if (!form.admissionNumber.trim()) {
    errors.admissionNumber = 'Admission number required hai.';
  } else if (!ADMISSION_REGEX.test(form.admissionNumber.trim())) {
    errors.admissionNumber = 'Sirf letters, numbers, - / allowed (3-20 chars).';
  }

  if (!form.rollNumber) {
    errors.rollNumber = 'Roll number required hai.';
  } else if (!/^\d+$/.test(form.rollNumber) || Number(form.rollNumber) <= 0 || Number(form.rollNumber) > 9999) {
    errors.rollNumber = 'Valid positive number do (1-9999).';
  }

  if (form.whatsAppNumber && !MOBILE_REGEX.test(form.whatsAppNumber.trim())) {
    errors.whatsAppNumber = '10-digit valid mobile number do (6-9 se start).';
  }

  if (form.dateOfBirth) {
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
    if (dob > today) {
      errors.dateOfBirth = 'DOB future me nahi ho sakti.';
    } else if (age < 2 || age > 25) {
      errors.dateOfBirth = 'Age 2 se 25 saal ke beech honi chahiye.';
    }
  }

  if (!['male', 'female', 'other'].includes(form.gender)) {
    errors.gender = 'Valid gender select karo.';
  }

  if (form.guardianName && !NAME_REGEX.test(form.guardianName.trim())) {
    errors.guardianName = 'Sirf letters allowed.';
  }

  return errors;
};

const StudentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const schoolId = '1'; // TODO: auth context se laana baad me

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

    const payload = {
      schoolId: parseInt(schoolId),
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      admissionNumber: form.admissionNumber.trim(),
      rollNumber: parseInt(form.rollNumber),
      whatsAppNumber: form.whatsAppNumber.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender,
      guardianName: form.guardianName.trim() || null,
      email: `student_${form.rollNumber}_${Date.now()}@edusuite.com`,
      password: 'password123',
    };

    try {
      setLoading(true);
      await API.post('/students', payload);
      alert('Student successfully enrolled! 🎉');
      navigate('/student');
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert(error.response?.data?.message || 'Kuch gadbad ho gayi, dobara try karo.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-slate-50/60 border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-gray-700 ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'
    }`;

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* 🟣 Top Header Bar */}
      <div className="bg-purple-900 px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate('/student')} className="text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">Student Enrollment</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-5xl mx-auto">

          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            {/* Panel intro */}
            <div className="flex items-start gap-3">
              <div className="bg-purple-50 text-purple-700 rounded-full w-9 h-9 flex items-center justify-center text-lg shrink-0">
                👤
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Student Admission</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fill in the required details. A login account will be created automatically.
                </p>
              </div>
            </div>

            {/* Section: Personal Details */}
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
                      onChange={handleChange('whatsAppNumber')}
                      className={`${inputClass('whatsAppNumber')} pl-9`} />
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

            {/* Section: Guardian / Parent */}
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

            {/* Full-width submit button */}
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