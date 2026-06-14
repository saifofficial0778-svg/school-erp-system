import axios from 'axios';

// 🏢 1. BASE URL CONFIGURATION
// Humne ek central instance bana diya taaki har function me poora URL baar-baar na likhna pade.
const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Hamari School API v1 ka base address
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// 🛠️ APNA CORE AXIOS LOGIC NEECHE LIKHO BHAI
// ==========================================

// 📊 MODULE 1: STUDENTS & ATTENDANCE APIS

// TASK 1: Get All Students List
export const fetchStudents = async () => {
  try {
    // 👇 BHAI, YAHAN APNA LOGIC LIKHO!
    // Niyam: API instance par .get() request bhejo '/students' endpoint par.
    // Hint: const response = await API.get('/students'); fir return response.data;
   const response=await API.get('/students');
   return response.data;
    
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// TASK 2: Submit Student Attendance Sheet
export const submitAttendance = async (attendanceData) => {
  try {
    // 👇 BHAI, YAHAN APNA LOGIC LIKHO!
    // Niyam: Attendance data ko server par bhejna hai, toh .post() request chalegi.
    // Endpoint hoga '/attendance'. Saath me 'attendanceData' ka object body me bhejenge.
    const response=await API.post('/attendance',(attendanceData));
    return response.data;

  } catch (error) {
    console.error("Error saving attendance:", error);
    throw error;
  }
};


// 💸 MODULE 2: FEE MANAGEMENT APIS

// TASK 3: Collect New Fee (Add Transaction)
export const collectStudentFee = async (feePayload) => {
  try {
    // 👇 BHAI, YAHAN APNA LOGIC LIKHO!
    // Niyam: Nayi fee entry create karni hai, yani fir se .post() request chalegi.
    // Endpoint hoga '/fees/collect'. Saath me 'feePayload' bhejenge.
    const response=await API.post('/fees/collect',(feePayload));
    return response.data;

  } catch (error) {
    console.error("Error collecting fee:", error);
    throw error;
  }
};

// TASK 4: Get Defaulters List
export const fetchPendingFees = async () => {
  try {
    // 👇 BHAI, YAHAN APNA LOGIC LIKHO!
    // Niyam: Server se pending balances data khinch ke lana hai, toh .get() request chalegi.
    // Endpoint hoga '/fees/pending'.
    const response=await API.get('/fees/pending');
    return response.data;

  } catch (error) {
    console.error("Error fetching pending fees:", error);
    throw error;
  }
};

export default API;