import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMigrantByPhone } from '../utils/dataProcessor.js';
import DashboardCard from '../components/DashboardCard.jsx';
import { FiUser, FiPhone, FiMapPin, FiHeart, FiActivity } from 'react-icons/fi';

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

  // Use optional chaining (?.) to safely access nested properties
  const { name, age, gender, phone: contact_number, originState, district, city, chronicIllness, pregnancy, conditionalInfo, health_profile } = migrant;

  return (
    <div>
      <Link to={-1} className="text-primary hover:underline mb-4 inline-block">&larr; Back to List</Link>
      
      {/* Migrant Header */}
      <DashboardCard className="mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
                <div className="flex items-center text-gray-500 space-x-4 mt-2">
                    <span><FiUser className="inline mr-1" /> {age}, {gender}</span>
                    <span><FiPhone className="inline mr-1" /> {contact_number}</span>
                    <span><FiMapPin className="inline mr-1" /> {city}, {district}</span>
                </div>
            </div>
            <span className={`px-4 py-2 text-md font-semibold rounded-full ${getStatusColor(health_profile?.overall_status)}`}>
                {health_profile?.overall_status || 'Status Unknown'}
            </span>
        </div>
      </DashboardCard>

      {/* Health Profile Grid - Simplified to match your data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Chronic Conditions">
            {chronicIllness && chronicIllness.length > 0 ? (
                <ul className="list-disc list-inside">
                    {chronicIllness.map(illness => (
                        <li key={illness}><FiHeart className="inline mr-2 text-red-500"/>{illness}</li>
                    ))}
                </ul>
            ) : <p>No chronic conditions reported.</p>}
        </DashboardCard>

        <DashboardCard title="Conditional Info">
            {pregnancy && pregnancy !== "Not Applicable" && (
                 <p className="mb-2"><strong>Pregnancy Status:</strong> {pregnancy}</p>
            )}
            {conditionalInfo ? (
                <p><strong>Notes:</strong> {conditionalInfo}</p>
            ) : <p>No additional information provided.</p>}
        </DashboardCard>
      </div>
    </div>
  );
};

export default MigrantDetailPage;