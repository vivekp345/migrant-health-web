import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBell, FiSearch, FiUser } from 'react-icons/fi';

const Sidebar = () => {
  // Common style for NavLink
  const navLinkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-lg";
  const activeClassName = "bg-primary text-white";

  return (
    <aside className="w-64 min-h-screen bg-background-blue p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-8">Migrant Health Monitor</h1>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard"
          end // 'end' prop ensures this only matches the exact path
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClassName : 'hover:bg-blue-200'}`}
        >
          <FiGrid className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/dashboard/alerts"
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClassName : 'hover:bg-blue-200'}`}
        >
          <FiBell className="mr-3" />
          Alerts
        </NavLink>
        <NavLink
          to="/dashboard/migrants"
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClassName : 'hover:bg-blue-200'}`}
        >
          <FiSearch className="mr-3" />
          Search Migrant
        </NavLink>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClassName : 'hover:bg-blue-200'}`}
        >
          <FiUser className="mr-3" />
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;