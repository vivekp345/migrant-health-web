import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard.jsx';
import { FiSearch, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';

const SearchMigrantsPage = () => {
  const [searchPhone, setSearchPhone] = useState('');
  const [migrant, setMigrant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchPhone) return;
    
    setIsLoading(true);
    setError('');
    setMigrant(null);

    try {
      const response = await fetch(`http://localhost:5000/api/migrants/${searchPhone}`);
      
      if (!response.ok) {
        throw new Error('Migrant not found in the database.');
      }
      
      const data = await response.json();
      setMigrant(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'Critical': return 'bg-red-100 text-red-700';
        case 'Under Observation': return 'bg-orange-100 text-orange-700';
        default: return 'bg-green-100 text-green-700';
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Live Migrant Database</h2>
      
      <DashboardCard className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Enter Migrant Phone Number"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center disabled:bg-gray-400"
          >
            <FiSearch className="mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </DashboardCard>

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      {migrant && (
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* UPDATED: Uses new field names */}
              <p className="font-bold text-xl">{migrant.fullName}</p>
              <div className="flex items-center text-gray-500 space-x-4 mt-1">
                <span><FiUser className="inline mr-1" />{migrant.age}, {migrant.gender}</span>
                <span><FiPhone className="inline mr-1" />{migrant.phoneNumber}</span>
                <span><FiMapPin className="inline mr-1" />{migrant.city}, {migrant.district}</span>
              </div>
            </div>
            <span className={`font-semibold px-4 py-1 rounded-full ${getStatusColor(migrant.health_profile?.overall_status)}`}>
              {migrant.health_profile?.overall_status || 'N/A'}
            </span>
          </div>

          <table className="w-full text-left">
            <tbody>
              {/* UPDATED: Uses new field names */}
              <tr className="border-b"><td className="p-2 font-semibold">Migration Type</td><td className="p-2">{migrant.migrantType}</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Chronic Illness</td><td className="p-2">{migrant.chronicDiseases || 'None'}</td></tr>
              <tr><td className="p-2 font-semibold">Pregnancy Details</td><td className="p-2">{migrant.pregnancyDetails || 'N/A'}</td></tr>
            </tbody>
          </table>
          <div className="text-center mt-6">
              <Link to={`/migrants/details/${migrant.phoneNumber}`} className="text-primary font-semibold hover:underline">
                  View Full Detailed Profile &rarr;
              </Link>
          </div>
        </DashboardCard>
      )}
    </div>
  );
};

export default SearchMigrantsPage;