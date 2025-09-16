import React, { useState, useEffect } from 'react'; // Import hooks
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getMigrantsByFilter } from '../utils/dataProcessor.js';
import DashboardCard from '../components/DashboardCard.jsx';

const MigrantListPage = () => {
  const { districtName, locationId } = useParams();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('filter');
  
  const [migrants, setMigrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');

  // Fetch data when the component mounts or filters change
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const filter = districtName 
            ? { districtName, status: statusFilter } 
            : { locationId: parseInt(locationId), status: statusFilter };

        const data = await getMigrantsByFilter(filter);
        setMigrants(data);

        // Set the title for the page
        const locationInfo = districtName || `Location #${locationId}`;
        setTitle(locationInfo);

        setIsLoading(false);
    };
    fetchData();
  }, [districtName, locationId, statusFilter]); // Re-fetch if any filter changes

  const getStatusColor = (status) => {
    switch (status) {
        case 'Critical': return 'text-red-600 font-semibold';
        case 'Under Observation': return 'text-orange-600 font-semibold';
        default: return 'text-green-600 font-semibold';
    }
  }
  
  if (isLoading) {
    return <DashboardCard title="Loading Migrant List...">Please wait...</DashboardCard>
  }

  return (
    <DashboardCard title={`Migrants in ${title} ${statusFilter === 'at-risk' ? '(At-Risk Only)' : ''}`}>
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
                <td className={`p-3 ${getStatusColor(migrant.health_profile.overall_status)}`}>
                    {migrant.health_profile.overall_status}
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