import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard.jsx';
import { FiUsers, FiActivity, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardKPIs, getCasesByDistrict, getCasesByLocation, getDiseaseTypes, getUniqueDistricts, getLocationsByDistrict } from '../utils/dataProcessor.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const DashboardPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [availableLocations, setAvailableLocations] = useState(['All Locations']);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);

      const filters = { district: selectedDistrict, location: selectedLocation };

      // Fetch all data in parallel for performance
      const [districts, kpiData, casesData, diseaseData] = await Promise.all([
        getUniqueDistricts(),
        getDashboardKPIs(filters),
        (selectedDistrict === 'All Districts') ? getCasesByDistrict(filters) : getCasesByLocation(selectedDistrict),
        getDiseaseTypes(filters)
      ]);

      if (allDistricts.length === 0) {
        setAllDistricts(districts);
      }
      setKpis(kpiData);
      setBarChartData(casesData);
      setPieChartData(diseaseData);

      // Update dependent location filter
      const newLocations = await getLocationsByDistrict(selectedDistrict);
      setAvailableLocations(newLocations);
      if (!newLocations.includes(selectedLocation)) {
        setSelectedLocation(newLocations[0]);
      }
      
      setIsLoading(false);
    };

    fetchAndProcessData();
  }, [selectedDistrict, selectedLocation]); // Re-fetch data whenever a filter changes

  const handleBarClick = (data) => {
    if (!data || !data.name) return;
    if (selectedDistrict === 'All Districts') {
      setSelectedDistrict(data.name); // Drill down by setting the district filter
    } else {
      navigate(`/migrants/by-location/${data.id}`); // Navigate to migrant list
    }
  };
  
  if (isLoading && allDistricts.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl text-gray-500">Loading Live Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Health Analytics Overview</h2>
        <div className="flex space-x-2">
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm">
            {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm">
            {availableLocations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard><p className="text-gray-500">Total Migrants</p><p className="text-2xl font-bold">{kpis.totalMigrants?.toLocaleString() || '...'}</p></DashboardCard>
        <DashboardCard><p className="text-gray-500">Active Cases (7 days)</p><p className="text-2xl font-bold">{kpis.activeCases?.toLocaleString() || '...'}</p></DashboardCard>
        <DashboardCard><p className="text-gray-500">Red Zone Hotspots</p><p className="text-2xl font-bold">{kpis.hotspots || '...'}</p></DashboardCard>
        <DashboardCard><p className="text-gray-500">Recovered (Total)</p><p className="text-2xl font-bold">{kpis.recovered?.toLocaleString() || '...'}</p></DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <DashboardCard title={selectedDistrict === 'All Districts' ? 'Cases by District' : `Cases in ${selectedDistrict}`} className="lg:col-span-3">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barChartData} onClick={(e) => e && e.activePayload && e.activePayload.length > 0 && handleBarClick(e.activePayload[0].payload)}>
                    <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="cases" fill="#82ca9d" cursor="pointer" />
                </BarChart>
            </ResponsiveContainer>
        </DashboardCard>
        <DashboardCard title="Disease Types" className="lg:col-span-2">
           <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardPage;