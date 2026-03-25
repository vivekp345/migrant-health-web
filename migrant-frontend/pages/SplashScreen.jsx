import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiBarChart2, FiAlertTriangle, FiUsers } from 'react-icons/fi';

const SplashScreen = () => {
  // Dummy data for the preview cards
  const stats = {
    activeCases: 123,
    hotspotDistricts: 5,
    registeredMigrants: '12,340',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-blue text-gray-800 font-sans">
      {/* Header Section */}
      <header className="px-8 py-4">
        <div className="flex items-center space-x-2 text-primary">
          <FiShield size={24} />
          <span className="font-semibold text-lg">Kerala Health</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Migrant Health Monitor Portal
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Integrated platform for migrant health tracking and hotspot surveillance
        </p>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 w-full max-w-4xl">
          {/* Active Cases Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-alert-green flex items-center space-x-4">
            <FiBarChart2 className="text-alert-green" size={32} />
            <div className="text-left">
              <p className="text-gray-500">Active Cases</p>
              <p className="text-2xl font-bold">{stats.activeCases}</p>
            </div>
          </div>

          {/* Hotspot Districts Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-alert-orange flex items-center space-x-4">
            <FiAlertTriangle className="text-alert-orange" size={32} />
            <div className="text-left">
              <p className="text-gray-500">Hotspot Districts</p>
              <p className="text-2xl font-bold">{stats.hotspotDistricts}</p>
            </div>
          </div>

          {/* Registered Migrants Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-300 flex items-center space-x-4">
            <FiUsers className="text-gray-500" size={32} />
            <div className="text-left">
              <p className="text-gray-500">Registered Migrants</p>
              <p className="text-2xl font-bold">{stats.registeredMigrants}</p>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <Link
          to="/login"
          className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-800 transition duration-300 shadow-lg"
        >
          Get Started
        </Link>
      </main>

      {/* Footer Section */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        Powered by Kerala Health Department
      </footer>
    </div>
  );
};

export default SplashScreen;