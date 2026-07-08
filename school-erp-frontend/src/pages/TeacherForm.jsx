import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  qualification: '',
  specialization: '',
  experienceYears: '',
  previousSchool: '',
  joiningDate: '',
  dateOfBirth: '',
  gender: 'male',
  address: '',
  salary: '',
  bankName: '',
  accountHolderName: '',
  accountNumber: '',
  ifscCode: '',
  accountType: 'savings',
};

const NAME_REGEX = /^[A-Za-z\s.'-]{2,50}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_NUMBER_REGEX = /^\d{9,18}$/;

const validateForm = (form) => {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = 'First name required hai.';
  else if (!NAME_REGEX.test(form.firstName.trim())) errors.firstName = 'Sirf letters allowed (2-50 chars).';

  if (form.lastName && !NAME_REGEX.test(form.lastName.trim())) errors.lastName = 'Sirf letters allowed.';

  if (!form.email.trim()) errors.email = 'Email required hai.';
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'Valid email address do.';

  if (form.phone && !MOBILE_REGEX.test(form.phone.trim()))
    errors.phone = '10-digit valid mobile number do (6-9 se start).';

  if (!form.qualification.trim()) errors.qualification = 'Qualification required hai.';
  else if (form.qualification.trim().length < 2) errors.qualification = 'Valid qualification do.';

  if (form.specialization && form.specialization.trim().length < 2)
    errors.specialization = 'Valid specialization do.';

  if (form.experienceYears) {
    if (!/^\d+$/.test(form.experienceYears) || Number(form.experienceYears) < 0 || Number(form.experienceYears) > 50)
      errors.experienceYears = 'Valid experience do (0-50 years).';
  }

  if (form.dateOfBirth) {
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
    if (dob > today) errors.dateOfBirth = 'DOB future me nahi ho sakti.';
    else if (age < 21 || age > 70) errors.dateOfBirth = 'Age 21-70 saal ke beech honi chahiye.';
  }

  if (form.joiningDate) {
    const jd = new Date(form.joiningDate);
    const today = new Date();
    if (jd > today) errors.joiningDate = 'Joining date future me nahi ho sakti.';
  }

  if (!['male', 'female', 'other'].includes(form.gender)) errors.gender = 'Valid gender select karo.';

  if (!form.salary) errors.salary = 'Salary required hai.';
  else if (!/^\d+(\.\d{1,2})?$/.test(form.salary) || Number(form.salary) <= 0)
    errors.salary = 'Valid salary amount do.';

  if (form.accountNumber && !ACCOUNT_NUMBER_REGEX.test(form.accountNumber.trim()))
    errors.accountNumber = 'Valid account number do (9-18 digits).';

  if (form.ifscCode && !IFSC_REGEX.test(form.ifscCode.trim().toUpperCase()))
    errors.ifscCode = 'Valid IFSC code do (e.g. SBIN0001234).';

  if (form.accountHolderName && !NAME_REGEX.test(form.accountHolderName.trim()))
    errors.accountHolderName = 'Sirf letters allowed.';

  return errors;
};

// Credentials Modal Component - same pattern as student
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
        <div className="text-center space-y-1">
          <div className="text-4xl">🎉</div>
          <h2 className="text-lg font-bold text-gray-800">Teacher Added Successfully!</h2>
          <p className="text-xs text-gray-500">Yeh credentials teacher ko share karo. Password sirf abhi dikhega.</p>
        </div>

        <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Email (Login ID)</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm text-gray-800 break-all">
            📧 {credentials.email}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Password</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm text-blue-700 font-bold tracking-widest">
            🔑 {credentials.password}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex gap-2 items-start">
          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-amber-700 font-medium">
            Yeh password dobara nahi dikhega. Abhi copy karke save kar lo ya teacher ko bhej do.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleCopy} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-2.5 rounded-xl transition-all">
            {copied ? '✅ Copied!' : '📋 Copy Credentials'}
          </button>
          <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-sm py-2.5 rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get('id'); // URL se ID nikal li

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // FETCH AND AUTO-FILL DATA (Agar edit mode hai)
  useEffect(() => {
    const getOldDetails = async () => {
      if (!teacherId) return; // Add mode me yahan se return kar do

      try {
        setLoading(true);
        const res = await API.get(`/teachers/${teacherId}`);
        if (res.data?.success) {
          const t = res.data.data;

          const nameParts = (t.full_name || '').trim().split(' ');
          const fName = nameParts[0] || '';
          const lName = nameParts.slice(1).join(' ') || '';

          setForm({
            firstName: fName,
            lastName: lName,
            email: t.email || '',
            phone: t.phone || '',
            qualification: t.qualification || '',
            specialization: t.specialization || '',
            experienceYears: t.experience_years ?? '',
            previousSchool: t.previous_school || '',
            joiningDate: t.joining_date ? t.joining_date.split('T')[0] : '',
            dateOfBirth: t.date_of_birth ? t.date_of_birth.split('T')[0] : '',
            gender: (t.gender || 'male').toLowerCase(),
            address: t.address || '',
            salary: t.salary ?? '',
            bankName: t.bank_name || '',
            accountHolderName: t.account_holder_name || '',
            accountNumber: t.account_number || '',
            ifscCode: t.ifsc_code || '',
            accountType: t.account_type || 'savings',
          });
        }
      } catch (error) {
        console.error("Purani details parse operations failure:", error);
        alert("Bhai, purani teacher profile load nahi ho payi!");
      } finally {
        setLoading(false);
      }
    };

    getOldDetails();
  }, [teacherId]);

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
      email: form.email.trim(),
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      phone: form.phone.trim() || null,
      qualification: form.qualification.trim(),
      specialization: form.specialization.trim() || null,
      experienceYears: form.experienceYears ? parseInt(form.experienceYears) : 0,
      previousSchool: form.previousSchool.trim() || null,
      joiningDate: form.joiningDate || null,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender,
      address: form.address.trim() || null,
      salary: parseFloat(form.salary),
      bankName: form.bankName.trim() || null,
      accountHolderName: form.accountHolderName.trim() || null,
      accountNumber: form.accountNumber.trim() || null,
      ifscCode: form.ifscCode.trim().toUpperCase() || null,
      accountType: form.accountType,
    };

    try {
      setLoading(true);

      if (teacherId) {
        // EDIT / UPDATE (PUT Request)
        const res = await API.put(`/teachers/${teacherId}`, payload);
        if (res.data.success) {
          alert("Teacher profile chaka-chak update ho gayi! 🎉");
          navigate('/teacher');
        }
      } else {
        // NEW ENROLLMENT (POST Request)
        const res = await API.post('/teachers', payload);
        if (res.data?.credentials) {
          setCredentials(res.data.credentials);
        } else {
          alert("Teacher add ho gaya!");
          navigate('/teacher');
        }
      }
    } catch (error) {
      console.error('Form execution failed:', error);
      alert(error.response?.data?.message || 'Kuch gadbad ho gayi, dobara try karo.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setCredentials(null);
    navigate('/teacher');
  };

  const inputClass = (field) =>
    `w-full bg-slate-50/60 border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-gray-700 ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
    }`;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {credentials && <CredentialsModal credentials={credentials} onClose={handleModalClose} />}

      {/* Header */}
      <div className="bg-blue-900 px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate('/teacher')} className="text-white text-xl">←</button>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {teacherId ? 'Edit Teacher Profile' : 'Teacher Onboarding'}
        </h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-10">

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 text-blue-700 rounded-full w-9 h-9 flex items-center justify-center text-lg shrink-0">🧑‍🏫</div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {teacherId ? 'Update Teacher Record' : 'New Teacher Registration'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {teacherId ? 'Modify profile data fields safely.' : 'Fill in the required details. A login account will be created automatically.'}
                </p>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-700 pl-3">
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

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Teacher Email * <span className="text-blue-600">(Login ID)</span></label>
                  <input type="email" placeholder="e.g. teacher@gmail.com" value={form.email}
                    onChange={handleChange('email')} className={inputClass('email')} />
                  {errors.email
                    ? <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    : <p className="text-xs text-gray-400 mt-1">Isi email se teacher portal login karega.</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📞</span>
                    <input type="text" placeholder="10-digit mobile number" value={form.phone}
                      onChange={handleChange('phone')} className={`${inputClass('phone')} pl-9`} />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
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

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Address</label>
                  <input type="text" placeholder="Enter full address" value={form.address}
                    onChange={handleChange('address')} className={inputClass('address')} />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Qualification & Employment */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-700 pl-3">
                <h3 className="text-sm font-bold text-gray-800">Qualification & Employment</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Qualification *</label>
                  <input type="text" placeholder="e.g. B.Ed, M.Sc" value={form.qualification}
                    onChange={handleChange('qualification')} className={inputClass('qualification')} />
                  {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Specialization</label>
                  <input type="text" placeholder="e.g. Mathematics" value={form.specialization}
                    onChange={handleChange('specialization')} className={inputClass('specialization')} />
                  {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Experience (Years)</label>
                  <input type="number" placeholder="e.g. 5" value={form.experienceYears}
                    onChange={handleChange('experienceYears')} className={inputClass('experienceYears')} />
                  {errors.experienceYears && <p className="text-xs text-red-500 mt-1">{errors.experienceYears}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Previous School</label>
                  <input type="text" placeholder="Previous school name" value={form.previousSchool}
                    onChange={handleChange('previousSchool')} className={inputClass('previousSchool')} />
                  {errors.previousSchool && <p className="text-xs text-red-500 mt-1">{errors.previousSchool}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Joining Date</label>
                  <input type="date" value={form.joiningDate}
                    onChange={handleChange('joiningDate')} className={inputClass('joiningDate')} />
                  {errors.joiningDate && <p className="text-xs text-red-500 mt-1">{errors.joiningDate}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Salary *</label>
                  <input type="number" placeholder="e.g. 35000" value={form.salary}
                    onChange={handleChange('salary')} className={inputClass('salary')} />
                  {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-700 pl-3">
                <h3 className="text-sm font-bold text-gray-800">Bank Details <span className="text-gray-400 font-normal">(Optional)</span></h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Bank Name</label>
                  <input type="text" placeholder="e.g. State Bank of India" value={form.bankName}
                    onChange={handleChange('bankName')} className={inputClass('bankName')} />
                  {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Account Holder Name</label>
                  <input type="text" placeholder="As per bank passbook" value={form.accountHolderName}
                    onChange={handleChange('accountHolderName')} className={inputClass('accountHolderName')} />
                  {errors.accountHolderName && <p className="text-xs text-red-500 mt-1">{errors.accountHolderName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Account Number</label>
                  <input type="text" placeholder="9-18 digit account number" value={form.accountNumber}
                    onChange={handleChange('accountNumber')} className={inputClass('accountNumber')} />
                  {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">IFSC Code</label>
                  <input type="text" placeholder="e.g. SBIN0001234" value={form.ifscCode}
                    onChange={handleChange('ifscCode')} className={inputClass('ifscCode')} />
                  {errors.ifscCode && <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Account Type</label>
                  <select value={form.accountType} onChange={handleChange('accountType')} className={inputClass('accountType')}>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                  </select>
                  {errors.accountType && <p className="text-xs text-red-500 mt-1">{errors.accountType}</p>}
                </div>
              </div>
            </div>

            {/* Dynamic Button Label */}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <span>
                {loading
                  ? (teacherId ? '⌛ Saving Profile...' : '⌛ Adding Teacher...')
                  : (teacherId ? '💾 Save Profile Changes' : '🧑‍🏫 Add Teacher')}
              </span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;