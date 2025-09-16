import React, { useState } from 'react';
import DashboardCard from '../components/DashboardCard.jsx';
import { FiSearch, FiUser, FiMapPin } from 'react-icons/fi';

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
      console.log(`Sending request to: http://localhost:5000/api/migrants/${searchPhone}`);
      const response = await fetch(`http://localhost:5000/api/migrants/${searchPhone}`);
      console.log('Received response from server:', response);

      if (!response.ok) {
        // Try to get error details from the response body
        const errorData = await response.json().catch(() => null);
        console.error('Server responded with an error:', response.status, errorData);
        throw new Error(`Migrant not found. Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched and parsed data:', data);
      setMigrant(data);

    } catch (err) {
      console.error('An error occurred during the fetch operation:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return 'bg-green-100 text-green-700';
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
              <p className="font-bold text-lg">{migrant.name}</p>
              <p className="text-gray-500"><FiUser className="inline mr-1" />{migrant.age}, {migrant.gender}</p>
              <p className="text-gray-500"><FiMapPin className="inline mr-1" />{migrant.district}, {migrant.state}</p>
            </div>
            <span className={`font-semibold px-4 py-1 rounded-full ${getStatusColor()}`}>Registered</span>
          </div>
          <table className="w-full text-left">
            <tbody>
              <tr className="border-b"><td className="p-2 font-semibold">Phone</td><td className="p-2">{migrant.phone}</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Origin</td><td className="p-2">{migrant.originDistrict}, {migrant.originState}</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Occupation</td><td className="p-2">{migrant.occupation}</td></tr>
              <tr><td className="p-2 font-semibold">Chronic Illness</td><td className="p-2">{migrant.chronicIllness.join(', ') || 'None'}</td></tr>
            </tbody>
          </table>
        </DashboardCard>
      )}
    </div>
  );
};

export default SearchMigrantsPage;