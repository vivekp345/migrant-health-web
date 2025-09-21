import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMigrantsByFilter } from '../utils/dataProcessor.js';
import DashboardCard from '../components/DashboardCard.jsx';

const MigrantListPage = () => {
  // This component handles multiple types of filters from the URL
  const { districtName, locationId, filterType } = useParams();
  
  const [migrants, setMigrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');

  // This effect runs whenever the URL parameters change to fetch the correct list
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        let filter = {};
        let pageTitle = '';

        // Determine the filter and title based on the URL parameter provided
        if (filterType) { // For pages like /migrants/list/active
          filter = { status: filterType };
          pageTitle = `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Migrants`;
          if(filterType === 'all') pageTitle = 'All Registered Migrants';
        } else if (districtName) { // For /migrants/by-district/...
          filter = { districtName };
          pageTitle = `Migrants in ${districtName}`;
        } else if (locationId) { // For /migrants/by-location/...
          const locationIdInt = parseInt(locationId);
          // Check if the URL has the special at-risk filter from the Alerts page
          const urlParams = new URLSearchParams(window.location.search);
          const statusFilter = urlParams.get('filter');
          filter = { locationId: locationIdInt, status: statusFilter };
          pageTitle = `Migrants in Location #${locationIdInt}`;
        }
        
        const data = await getMigrantsByFilter(filter);
        setMigrants(data);
        setTitle(pageTitle);
        setIsLoading(false);
    };
    fetchData();
  }, [districtName, locationId, filterType]); // Re-fetch if any of these URL params change

  // Helper function for styling the health status text
  const getStatusColor = (status) => {
    switch (status) {
        case 'Critical': return 'text-red-600 font-semibold';
        case 'Under Observation': return 'text-orange-600 font-semibold';
        case 'Recovered': return 'text-blue-600 font-semibold';
        default: return 'text-green-600 font-semibold';
    }
  }
  
  if (isLoading) {
    return <DashboardCard title="Loading Migrant List...">Please wait...</DashboardCard>
  }

  return (
    <DashboardCard title={title}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Phone</th>
              <th className="p-3">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Overall Status</th>
            </tr>
          </thead>
          <tbody>
            {migrants.map(migrant => (
              <tr key={migrant.phone} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link to={`/migrants/details/${migrant.phone}`} className="text-primary hover:underline">
                    {migrant.phone}
                  </Link>
                </td>
                <td className="p-3">{migrant.name}</td>
                <td className="p-3">{migrant.age}</td>
                <td className="p-3">{migrant.gender}</td>
                <td className={`p-3 ${getStatusColor(migrant.health_profile?.overall_status)}`}>
                    {migrant.health_profile?.overall_status || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {migrants.length === 0 && <p className="text-center p-4">No migrant data available for this filter.</p>}
      </div>
    </DashboardCard>
  );
};

export  default MigrantListPage;