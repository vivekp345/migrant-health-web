import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMigrantByPhone } from '../utils/dataProcessor.js';
import DashboardCard from '../components/DashboardCard.jsx';
import { FiUser, FiPhone, FiMapPin, FiHeart, FiDroplet, FiShield } from 'react-icons/fi';

const MigrantDetailPage = () => {
  const { phone } = useParams();
  const [migrant, setMigrant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMigrantData = async () => {
      setIsLoading(true);
      const data = await getMigrantByPhone(phone);
      setMigrant(data);
      setIsLoading(false);
    };
    loadMigrantData();
  }, [phone]);

  if (isLoading) {
    return <DashboardCard title="Loading Migrant Data...">Please wait...</DashboardCard>;
  }

  if (!migrant) {
    return <DashboardCard title="Error">Migrant with phone number {phone} not found.</DashboardCard>;
  }
    
  const getStatusColor = (status) => {
    switch (status) {
        case 'Critical': return 'bg-red-100 text-red-700';
        case 'Under Observation': return 'bg-orange-100 text-orange-700';
        default: return 'bg-green-100 text-green-700';
    }
  }

  // Safely destructure properties
  const { fullName, age, gender, phoneNumber, district, city, chronicDiseases, pregnancyDetails, conditionalInfo, health_profile } = migrant;

  return (
    <div>
      <Link to={-1} className="text-primary hover:underline mb-4 inline-block">&larr; Back to List</Link>
      
      <DashboardCard className="mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">{fullName || 'N/A'}</h2>
                <div className="flex items-center text-gray-500 space-x-4 mt-2">
                    <span><FiUser className="inline mr-1" /> {age}, {gender}</span>
                    <span><FiPhone className="inline mr-1" /> {phoneNumber}</span>
                    <span><FiMapPin className="inline mr-1" /> {city}, {district}</span>
                </div>
            </div>
            <span className={`px-4 py-2 text-md font-semibold rounded-full ${getStatusColor(health_profile?.overall_status)}`}>
                {health_profile?.overall_status || 'Status Unknown'}
            </span>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Health Information">
            <p className="mb-2">
                <strong>Chronic Conditions:</strong> {chronicDiseases || 'None reported'}
            </p>
            {pregnancyDetails && pregnancyDetails !== "Not Applicable" && (
                 <p><strong>Pregnancy Status:</strong> {pregnancyDetails}</p>
            )}
        </DashboardCard>

        <DashboardCard title="Additional Notes">
            <p>{conditionalInfo || 'No additional information provided.'}</p>
        </DashboardCard>
      </div>
    </div>
  );
};

export default MigrantDetailPage;