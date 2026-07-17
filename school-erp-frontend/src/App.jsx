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
import TeacherForm from './pages/TeacherForm';
import Teacher from './pages/Teacher';
import TeacherView from './pages/TeacherView';
import ClassManagement from './pages/ClassManagement';
import RoleRoute from './components/RoleRoute'; // ✅ NEW: role-based access guard

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
        {/* 🟢 1. SINGLE ROOT PATH */}
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
          {/* --- ADMIN ONLY --- */}
          <Route path="/dashboard" element={
            <RoleRoute allowed={['admin']}><Dashboard /></RoleRoute>
          } />
          <Route path="/students" element={
            <RoleRoute allowed={['admin']}><Student /></RoleRoute>
          } />
          <Route path="/settings" element={
            <RoleRoute allowed={['admin']}><Setting /></RoleRoute>
          } />
          <Route path="/fees" element={
            <RoleRoute allowed={['admin']}><FeeManagement /></RoleRoute>
          } />
          <Route path="/fee-collection" element={
            <RoleRoute allowed={['admin']}><FeeCollection /></RoleRoute>
          } />
          <Route path="/pending-fees" element={
            <RoleRoute allowed={['admin']}><PendingFees /></RoleRoute>
          } />
          <Route path="/student/new" element={
            <RoleRoute allowed={['admin']}><StudentForm /></RoleRoute>
          } />
          <Route path="/teacher" element={
            <RoleRoute allowed={['admin']}><Teacher /></RoleRoute>
          } />
          <Route path="/teacher/new" element={
            <RoleRoute allowed={['admin']}><TeacherForm /></RoleRoute>
          } />
          <Route path="/classes" element={
            <RoleRoute allowed={['admin']}><ClassManagement /></RoleRoute>
          } />

          {/* --- ADMIN + TEACHER --- */}
          <Route path="/attendance" element={
            <RoleRoute allowed={['admin', 'teacher']}><Attendance /></RoleRoute>
          } />
          <Route path="/attendance-report" element={
            <RoleRoute allowed={['admin', 'teacher']}><AttendanceReport /></RoleRoute>
          } />
          <Route path="/teacher/profile-view" element={
            <RoleRoute allowed={['admin', 'teacher']}><TeacherView /></RoleRoute>
          } />

          {/* --- ADMIN + STUDENT --- */}
          <Route path="/student/profile-view" element={
            <RoleRoute allowed={['admin', 'student']}><StudentView /></RoleRoute>
          } />
        </Route>

        {/* 🚨 4. FALLBACK ROUTE */}
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