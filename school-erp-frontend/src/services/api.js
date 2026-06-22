import axios from 'axios';

// 🏢 BASE URL CONFIGURATION (Railway Production Hub)
const API = axios.create({
  baseURL: 'https://school-erp-system-production.up.railway.app/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 🛡️ AXIOS REQUEST INTERCEPTOR (SECURITY GUARD)
// ==========================================

API.interceptors.request.use(
  async (config) => {
    // 👑 CRITICAL MATCH: AuthContext aur login ke sath key sync rakhi hai ('token')
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// 🔑 AUTHENTICATION SERVICES (NEW SLOT 2 ADDITION)
// ==========================================

// Handle Executive Admin Login Connection
export const loginAdmin = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error("Auth API validation failure:", error.message);
    throw error;
  }
};

// ==========================================
// 💸 APNI PURANI API SERVICES (100% PRESERVED)
// ==========================================

// Get All Students List
export const fetchStudents = async (schoolId) => {
  try {
    const response = await API.get(schoolId ? `/students?schoolId=${schoolId}` : '/students');
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Submit Student Attendance Sheet
export const submitAttendance = async (attendanceData) => {
  try {
    const response = await API.post('/attendance', attendanceData);
    return response.data;
  } catch (error) {
    console.error("Error saving attendance:", error);
    throw error;
  }
};

// Collect New Fee (Add Transaction)
export const collectStudentFee = async (feePayload) => {
  try {
    const response = await API.post('/fees/collect', feePayload);
    return response.data;
  } catch (error) {
    console.error("Error collecting fee:", error);
    throw error;
  }
};

// Get Defaulters List
export const fetchPendingFees = async () => {
  try {
    const response = await API.get('/fees/pending');
    return response.data;
  } catch (error) {
    console.error("Error fetching pending fees:", error);
    throw error;
  }
};

export default API;