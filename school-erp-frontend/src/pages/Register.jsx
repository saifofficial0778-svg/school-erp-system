import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // 📝 1. STATE MANAGEMENT
  // Dono fields ko control karne ke liye state bani hai jo direct DB columns se map hongi
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔄 2. INPUT CHANGE HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🚀 3. FORM SUBMISSION HANDLER
  // 🚀 3. FORM SUBMISSION HANDLER (FULL PRODUCTION LOGIC)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 🚨 1. AIRTIGHT VALIDATION
    // Agar ek bhi field khali hai (or space dekar pass ki hai), toh aage mat badho
    if (!formData.schoolName.trim() || !formData.email.trim() || !formData.password.trim()) {
        setError("Bhai, saari fields bharna zaroori hai!");
        setLoading(false);
        return;
    }

    try {
        // 🔄 2. API CALL TO BACKEND
        // API connect pipeline jo backend database me directly insert karegi
        // Note: Agar api service file ready hai toh direct axios.post bhi use kar sakte ho
        const response = await axios.post('/register-school', {
            schoolName: formData.schoolName,
            email: formData.email,
            password: formData.password,
            role: 'admin' // 👑 School creator hamesha master admin hoga database me
        });

        // 🟢 3. SUCCESS HANDLING
        if (response.data.success) {
            setLoading(false);
            alert("School Registration Kamyab Raha! 🏫🚀 Ab login karo.");
            
            // Redirect user directly to login matrix screen
            navigate('/login');
        }

    } catch (err) {
        // 🔴 4. ERROR HANDLING (Catching Duplicity / Server Crashes)
        console.error("Registration UI Error:", err);
        
        // Agar backend bolta hai "Email already exists", toh use error state me daalo
        const serverErrorMessage = err.response?.data?.message || "Server me kuch gadbad hai, bhai!";
        setError(serverErrorMessage);
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100 px-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            School Register
          </h2>
          <p className="text-slate-400 text-sm mt-2">Create a premium admin account for your school</p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Field 1: School Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              School Name
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="e.g. Greenwood High School"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
              required
            />
          </div>

          {/* Field 2: Admin Email (Maps to DB: email) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@school.com"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
              required
            />
          </div>

          {/* Field 3: Password (Maps to DB: password) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Creating Account...' : 'Register School'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;