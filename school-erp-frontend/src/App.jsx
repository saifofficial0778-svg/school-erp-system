import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import StudentView from './pages/StudentView';
import Teacher from '../../school_erp_backend/models/teacherModel';
import TeacherForm from './pages/TeacherForm';

// 🛡️ 1. GUEST GUARD: Logged in users ko public matrix se bahar rakhega
const GuestRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen font-mono text-xs text-slate-400">Verifying session...</div>;

  return token ? <Navigate to="/dashboard" replace /> : children;
};

// 🛡️ 2. AUTH GUARD: Unauthenticated users ko seedhe landing page par phekega
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen font-mono text-xs text-slate-400">Verifying security matrix...</div>;

  return token ? children : <Navigate to="/" replace />;
};

function AppContent() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        {/* 🟢 1. SINGLE ROOT PATH: Pehli baar kholne par sirf aur sirf LandingPage khulega */}
        <Route path="/" element={<LandingPage />} />

        {/* 📋 2. PUBLIC/GUEST PAGES */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* 🔒 3. PROTECTED LAYOUT SUBSYSTEM */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Student />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/fees" element={<FeeManagement />} />
          <Route path="/fee-collection" element={<FeeCollection />} />
          <Route path="/pending-fees" element={<PendingFees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance-report" element={<AttendanceReport />} />
          <Route path="/student/new" element={<StudentForm />} />
          <Route path="/student/profile-view" element={<StudentView />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/teacher/new" element={<TeacherForm />} />
          <Route path="/teacher/profile-view" element={<TeacherView />} />
        </Route>

        {/* 🚨 4. FALLBACK ROUTE: Kuch galat mila toh user status ke mutabik navigate karo */}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}