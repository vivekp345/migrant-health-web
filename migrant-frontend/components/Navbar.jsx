import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear auth tokens here
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-700">Government Health Analytics Dashboard</h2>
      <div className="flex items-center space-x-4">
        <img
          src="https://i.pravatar.cc/40?img=1" // Placeholder avatar
          alt="Official's Avatar"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={handleLogout}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;