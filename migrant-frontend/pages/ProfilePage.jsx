import React from 'react';
import DashboardCard from '../components/DashboardCard.jsx';

// Dummy data for the official's profile (avatar property removed)
const officialProfile = {
  name: 'Dr. Ananya Nair',
  title: 'District Medical Officer, Ernakulam',
  username: 'ananya.nair',
  role: 'Health Official',
  email: 'ananya.nair@gov.in',
  jurisdiction: 'Ernakulam, Kerala',
};

const ProfilePage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

      {/* Profile Header Card (Image tag removed) */}
      <DashboardCard className="mb-6">
        <div>
          <h3 className="text-2xl font-bold">{officialProfile.name}</h3>
          <p className="text-gray-600">{officialProfile.title}</p>
        </div>
      </DashboardCard>

      {/* Official Information Card */}
      <DashboardCard title="Official Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <p className="mt-1 p-2 bg-gray-100 rounded-md">{officialProfile.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 p-2 bg-gray-100 rounded-md">{officialProfile.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 p-2 bg-gray-100 rounded-md">{officialProfile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">District Jurisdiction</label>
            <p className="mt-1 p-2 bg-gray-100 rounded-md">{officialProfile.jurisdiction}</p>
          </div>
        </div>
        <div className="text-right mt-6">
          <button className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition duration-300">
            Edit Profile
          </button>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ProfilePage;