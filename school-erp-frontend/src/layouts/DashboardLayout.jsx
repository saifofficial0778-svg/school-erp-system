import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  // State to track if sidebar is open on mobile screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      
      {/* 1. SIDEBAR: Choti screen par hide hoga, open hone par slide karke aayega */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Mobile view backdrop overlay (sidebar khulne par background dark karne ke liye) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Right side content area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Navbar me hum toggle function pass kar rahe hain taaki 3-lines button kaam kare */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;