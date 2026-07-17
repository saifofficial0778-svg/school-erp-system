import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Usage in App.jsx:
 * <Route path="/students" element={
 *   <RoleRoute allowed={['admin']}>
 *     <Student />
 *   </RoleRoute>
 * } />
 *
 * Agar user ka role 'allowed' list me nahi hai, to use uske apne
 * "home" page pe bhej deta hai (admin -> dashboard, teacher -> attendance)
 * taaki blank/crash screen na dikhe.
 */
const RoleRoute = ({ allowed, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowed.includes(user.role)) {
    // ✅ NEW: har role ka apna safe "home" page — warna galat role /dashboard pe baar-baar bounce karega
    const fallbackMap = {
      teacher: '/attendance',
      student: '/student/profile-view',
    };
    const fallback = fallbackMap[user.role] || '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RoleRoute;