import axios from 'axios';

// 🏢 BASE URL CONFIGURATION
const API = axios.create({
 baseURL: 'https://school-erp-system-production.up.railway.app/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 🛡️ AXIOS REQUEST INTERCEPTOR (SECURITY GUARD)
// ==========================================

// API.interceptors.request.use() har request ke nikalte hi activate ho jata hai
API.interceptors.request.use(
  async (config) => {
   
    const token=localStorage.getItem('school_token')
    if(token){
      config.headers.Authorization=`Bearer ${token}`
    }

    
    return config; // Updated configuration ke sath request aage nikal jayegi
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// 💸 APNI PURANI API SERVICES (JO KAL BANAYI THI)
// ==========================================

// Get All Students List
export const fetchStudents = async () => {
  try {
    const response = await API.get('/students');
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