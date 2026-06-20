const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200">
      
      {/* LEFT SIDE: Hamburger Button + Title */}
      <div className="flex items-center space-x-3">
        
        {/* 🍔 3-Lines Hamburger Button */}
        {/* lg:hidden ka matlab hai badi screen par hide hoga, choti par block (dikhega) */}
        <button 
          onClick={toggleSidebar}
          type="button"
          className="lg:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-slate-800 transition-colors focus:outline-none block"
          aria-label="Open sidebar"
        >
          {/* Ekdum clean 3 horizontal lines browser svg template */}
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        
        {/* Page Title */}
        <div className="text-base sm:text-lg font-semibold text-gray-700 hidden sm:block">
          Welcome, Admin
        </div>
      </div>

      {/* RIGHT SIDE: Profile Info */}
      <div className="flex items-center space-x-4">
        <span className="text-xs sm:text-sm text-gray-500 hidden xs:block">Academic Year: 2026-27</span>
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;