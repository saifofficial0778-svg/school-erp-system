import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import Student from './pages/Student'; // Sahi file name match kiya
import Setting from './pages/Setting'; // Sahi file name match kiya
import FeeManagement from './pages/FeeManagement';
import FeeCollection from './pages/FeeCollection';
import PendingFees from './pages/PendingFees';
import Attendance from './pages/Attendance';
import AttendanceReport from './pages/AttendanceReport';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route standalone rahega */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard routes layout ke andar */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Student />} />
          <Route path="settings" element={<Setting />} />
          <Route path="/fees" element={<FeeManagement/>}/>
          <Route path="/fee-collection" element={<FeeCollection/>}/>
          <Route path="/pending-fees" element={<PendingFees/>}/>
          <Route path="/attendance" element={<Attendance/>}/>
          <Route path="/attendance-report" element={<AttendanceReport/>}/>
        </Route>

        {/* Galat URL par direct login par bhejega */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;