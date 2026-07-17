import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // ✅ user bhi chahiye role check karne ke liye

  // ✅ NEW: har menu item ko 'roles' array diya — jo roles is list me hain unhi ko dikhega
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['admin'] },
    { name: 'Students', path: '/students', roles: ['admin'] },
    { name: 'Teachers', path: '/teacher', roles: ['admin'] },
    { name: 'Class Management', path: '/classes', roles: ['admin'] },
    { name: 'Fee Management', path: '/fees', roles: ['admin'] },
    { name: 'Pending Fee', path: '/pending-fees', roles: ['admin'] },
    { name: 'Attendance', path: '/attendance', roles: ['admin', 'teacher'] },
    { name: 'Attendance Report', path: '/attendance-report', roles: ['admin', 'teacher'] },
    { name: 'My Profile', path: '/teacher/profile-view', roles: ['teacher'] }, // ✅ teacher ka apna profile link
    { name: 'My Profile', path: '/student/profile-view', roles: ['student'] }, // ✅ NEW: student ka apna profile link
    { name: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  // ✅ NEW: sirf wahi items rakho jinke 'roles' array me current user ka role ho
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    if (closeSidebar) closeSidebar();
    navigate('/login', { replace: true });
  };

  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col h-full shadow-xl">
      <div className="p-5 text-xl font-bold border-b border-slate-700 tracking-wider flex justify-between items-center">
        <span>SCHOOL ERP</span>
        <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ✅ NEW: role badge dikhao taaki pata chale kis role se login hai */}
      {user?.role && (
        <div className="px-5 py-3 border-b border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-700 text-slate-300">
            {user.role} view
          </span>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`block px-4 py-2.5 rounded transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;