import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex bg-background-light min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-grow p-8">
          {/* Outlet renders the specific page component (e.g., DashboardPage) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;