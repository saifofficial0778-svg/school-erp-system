import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. Ensure closeSidebar prop is received here
const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // 🔥 AuthContext ka asli logout function

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/students' },
    { name: 'Teachers', path: '/teacher' },
    { name: 'Fee Management', path: '/fees' },
    { name: "Pending Fee", path: '/pending-fees' },
    { name: "Attendance", path: '/attendance' },
    { name: "Attendance Report", path: "/attendance-report" },
    { name: 'Settings', path: '/settings' }
  ];

  // 🚪 LOGOUT HANDLER
  const handleLogout = () => {
    logout(); // Context ka state + localStorage dono clear ho jayenge
    if (closeSidebar) closeSidebar(); // Sidebar close karo (mobile view ke liye)
    navigate('/login', { replace: true }); // Login page pe bhej do
  };

  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col h-full shadow-xl">
      {/* Heading Group */}
      <div className="p-5 text-xl font-bold border-b border-slate-700 tracking-wider flex justify-between items-center">
        <span>SCHOOL ERP</span>
        {/* Mobile close button (X) */}
        <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              // 🔥 MAGIC LINE: Click karte hi closeSidebar function chalega aur mobile layout me close ho jayega
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

      {/* 🚪 LOGOUT BUTTON — neeche fix rahega */}
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