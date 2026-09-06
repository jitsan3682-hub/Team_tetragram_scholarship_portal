import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#141210] text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user?.role || 'student'} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
