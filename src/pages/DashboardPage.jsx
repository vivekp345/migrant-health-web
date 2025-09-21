import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardData, getUniqueDistricts, getLocationsByDistrict, getCasesByLocation } from '../utils/dataProcessor.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const DashboardPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({ kpis: {}, casesByDistrict: [], diseaseTypes: [] });
    const [drillDownData, setDrillDownData] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
    const [availableLocations, setAvailableLocations] = useState(['All Locations']);
    const [selectedLocation, setSelectedLocation] = useState('All Locations');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch all dashboard data based on the current district filter
                const data = await getDashboardData({ district: selectedDistrict });
                setDashboardData(data);
                
                // If a specific district is selected, fetch its locations for the drill-down chart
                if (selectedDistrict !== 'All Districts') {
                    const locationCases = await getCasesByLocation(selectedDistrict);
                    setDrillDownData(locationCases);
                }

                // Populate filter dropdowns
                if (allDistricts.length === 0) {
                    const districts = await getUniqueDistricts();
                    setAllDistricts(districts);
                }
                const newLocations = await getLocationsByDistrict(selectedDistrict);
                setAvailableLocations(newLocations);
                
                // Reset location filter when district changes
                setSelectedLocation(newLocations[0]);

            } catch (error) {
                console.error("Failed to load dashboard:", error);
            }
            setIsLoading(false);
        };
        loadData();
    }, [selectedDistrict]); // Re-fetch data ONLY when the main district filter changes

    const handleBarClick = (data) => {
        if (!data || !data.name) return;
        if (selectedDistrict === 'All Districts') {
            setSelectedDistrict(data.name);
        } else {
            // When clicking a location, we can navigate to a more specific list if needed
            console.log("Navigate to migrants in:", data.name);
            // Example navigation: navigate(`/migrants/by-location/${data.id}`);
        }
    };
    
    // Determine which data to show in the bar chart
    const barChartData = selectedDistrict === 'All Districts' ? dashboardData.casesByDistrict : drillDownData;

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Live Dashboard Data...</div>;
    }

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Health Analytics Overview</h2>
                <div className="flex space-x-2">
                    <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm">
                        {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="p-2 border rounded-lg bg-white shadow-sm" disabled={selectedDistrict === 'All Districts'}>
                        {availableLocations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
            </div>
            {/* KPI Cards section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Link to="/migrants/list/all" className="block"><DashboardCard className="hover:bg-gray-50 transition-colors"><p className="text-gray-500">Total Migrants</p><p className="text-2xl font-bold">{dashboardData.kpis.totalMigrants?.toLocaleString()}</p></DashboardCard></Link>
                <Link to="/migrants/list/active" className="block"><DashboardCard className="hover:bg-gray-50 transition-colors"><p className="text-gray-500">Active Cases</p><p className="text-2xl font-bold">{dashboardData.kpis.activeCases?.toLocaleString()}</p></DashboardCard></Link>
                <Link to="/dashboard/alerts" className="block"><DashboardCard className="hover:bg-gray-50 transition-colors"><p className="text-gray-500">Red Zone Hotspots</p><p className="text-2xl font-bold">{dashboardData.kpis.hotspots}</p></DashboardCard></Link>
                <Link to="/migrants/list/recovered" className="block"><DashboardCard className="hover:bg-gray-50 transition-colors"><p className="text-gray-500">Recovered</p><p className="text-2xl font-bold">{dashboardData.kpis.recovered?.toLocaleString()}</p></DashboardCard></Link>
            </div>
            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <DashboardCard title={selectedDistrict === 'All Districts' ? 'Active Cases by District' : `Active Cases by Location in ${selectedDistrict}`} className="lg:col-span-3">
                    {selectedDistrict !== 'All Districts' && <button onClick={() => setSelectedDistrict('All Districts')} className="text-primary hover:underline mb-2">&larr; Back to All Districts</button>}
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={barChartData} onClick={(e) => e && e.activePayload && e.activePayload.length > 0 && handleBarClick(e.activePayload[0].payload)}>
                            <XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="cases" fill="#82ca9d" cursor="pointer" />
                        </BarChart>
                    </ResponsiveContainer>
                </DashboardCard>
                <DashboardCard title="Disease Types (from Chronic Illness)" className="lg:col-span-2">
                   <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie data={dashboardData.diseaseTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                        {dashboardData.diseaseTypes && dashboardData.diseaseTypes.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
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