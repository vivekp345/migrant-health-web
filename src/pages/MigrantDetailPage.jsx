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

  const { name, age, gender, contact_number, origin_state, health_profile, locationDetails } = migrant;

  return (
    <div>
      <Link to={-1} className="text-primary hover:underline mb-4 inline-block">&larr; Back to List</Link>
      <DashboardCard className="mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
                <div className="flex items-center text-gray-500 space-x-4 mt-2">
                    <span><FiUser className="inline mr-1" /> {age}, {gender}</span>
                    <span><FiPhone className="inline mr-1" /> {contact_number}</span>
                    <span><FiMapPin className="inline mr-1" /> From {origin_state}</span>
                </div>
            </div>
            <span className={`px-4 py-2 text-md font-semibold rounded-full ${getStatusColor(health_profile.overall_status)}`}>
                {health_profile.overall_status}
            </span>
        </div>
      </DashboardCard>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
            <DashboardCard title="Vitals">
                 <div className="grid grid-cols-2 gap-4">
                    <p><strong><FiHeart className="inline mr-2 text-red-500"/>Blood Pressure:</strong> {health_profile.vitals.blood_pressure}</p>
                    <p><strong><FiDroplet className="inline mr-2 text-blue-500"/>Blood Sugar:</strong> {health_profile.vitals.blood_sugar}</p>
                 </div>
            </DashboardCard>
            <DashboardCard title="Chronic Conditions">
                {health_profile.conditions.length > 0 ? (
                    <ul>
                        {health_profile.conditions.map(cond => (
                            <li key={cond.name}><strong>{cond.name}:</strong> {cond.status}</li>
                        ))}
                    </ul>
                ) : <p>No chronic conditions reported.</p>}
            </DashboardCard>
        </div>
        <div className="flex flex-col gap-6">
            <DashboardCard title="Disease Screenings">
                {health_profile.screenings.length > 0 ? (
                    <ul className="space-y-2">
                        {health_profile.screenings.map(screen => (
                            <li key={screen.disease}>
                                <FiShield className="inline mr-2 text-primary"/>
                                <strong>{screen.disease}:</strong> {screen.result} (Last on: {screen.last_screened_date})
                            </li>
                        ))}
                    </ul>
                ) : <p>No screening data available.</p>}
            </DashboardCard>
            <DashboardCard title="Recent Checkups">
                {health_profile.recent_checkups.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50"><tr><th className="p-2">Date</th><th className="p-2">Reason</th><th className="p-2">Notes</th></tr></thead>
                            <tbody>
                                {health_profile.recent_checkups.map(checkup => (
                                    <tr key={checkup.date} className="border-b"><td className="p-2">{checkup.date}</td><td className="p-2">{checkup.reason}</td><td className="p-2">{checkup.notes}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p>No recent checkups.</p>}
            </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default MigrantDetailPage;