import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // 🔥 AuthContext import kiya
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import Student from './pages/Student'; 
import Setting from './pages/Setting'; 
import FeeManagement from './pages/FeeManagement';
import FeeCollection from './pages/FeeCollection';
import PendingFees from './pages/PendingFees';
import Attendance from './pages/Attendance';
import AttendanceReport from './pages/AttendanceReport';
import StudentForm from './pages/StudentForm';

// 🛡️ 1. GUEST GUARD: Agar logged in ho, toh login page par dobara nahi jaane dega
const GuestRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen font-mono text-xs text-slate-400">Verifying session...</div>;
  
  return token ? <Navigate to="/dashboard" replace /> : children;
};

// 🛡️ 2. AUTH GUARD: Agar logged in nahi ho, toh direct login par kick out karega
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen font-mono text-xs text-slate-400">Verifying security matrix...</div>;

  return token ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        {/* 🔐 Login route protected by GuestGuard */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />

        {/* 🔒 Dashboard Layout & sub-routes completely sealed inside ProtectedRoute */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Base URL mapping filter */}
          <Route index element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Student />} />
          <Route path="settings" element={<Setting />} />
          <Route path="fees" element={<FeeManagement/>}/>
          <Route path="fee-collection" element={<FeeCollection/>}/>
          <Route path="pending-fees" element={<PendingFees/>}/>
          <Route path="attendance" element={<Attendance/>}/>
          <Route path="attendance-report" element={<AttendanceReport/>}/>
          <Route path="Student/new" element={<StudentForm/>}/>
        </Route>

        {/* Fallback route mapping wildcard error deflection */}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

// 🌍 Pura application AuthProvider ke ghere me wrapper setup
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}