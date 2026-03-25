import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getMigrantsByFilter } from '../utils/dataProcessor.js';
import DashboardCard from '../components/DashboardCard.jsx';

const MigrantListPage = () => {
  const { districtName, locationId, filterType } = useParams();
  const [searchParams] = useSearchParams();
  
  const [migrants, setMigrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        let filter = {};
        let pageTitle = '';

        const statusFilter = searchParams.get('filter'); 

        if (filterType) {
          filter = { status: filterType };
          pageTitle = `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Migrants`;
          if(filterType === 'all') pageTitle = 'All Registered Migrants';
        } else if (districtName) {
          const apiStatus = statusFilter === 'at-risk' ? 'active' : statusFilter;
          filter = { districtName, status: apiStatus };
          pageTitle = `At-Risk Migrants in ${districtName}`;
        } else if (locationId) {
          filter = { locationId: parseInt(locationId), status: statusFilter };
          pageTitle = `Migrants in Location #${locationId}`;
        }
        
        try {
            const data = await getMigrantsByFilter(filter);
            setMigrants(data);
        } catch (error) {
            console.error("Failed to fetch migrant list:", error);
            setMigrants([]);
        }
        
        setTitle(pageTitle);
        setIsLoading(false);
    };
    fetchData();
  }, [districtName, locationId, filterType, searchParams]);

  const getStatusColor = (status) => {
    switch (status) {
        case 'Critical': return 'text-red-600 font-semibold';
        case 'Under Observation': return 'text-orange-600 font-semibold';
        case 'Recovered': return 'text-blue-600 font-semibold';
        default: return 'text-green-600 font-semibold';
    }
  };
  
  if (isLoading) {
    return <DashboardCard title="Loading Migrant List...">Please wait...</DashboardCard>
  }

  return (
    <DashboardCard title={title}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Phone Number</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Overall Status</th>
            </tr>
          </thead>
          <tbody>
            {migrants.map(migrant => (
              <tr key={migrant.phoneNumber} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {/* UPDATED: Link now uses the new 'phoneNumber' field */}
                  <Link to={`/migrants/details/${migrant.phoneNumber}`} className="text-primary hover:underline">
                    {migrant.phoneNumber}
                  </Link>
                </td>
                {/* UPDATED: Displays the new 'fullName' field */}
                <td className="p-3">{migrant.fullName}</td>
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

export default MigrantListPage;