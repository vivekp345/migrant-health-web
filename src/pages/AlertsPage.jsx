import React, { useState, useEffect } from 'react'; // Import hooks
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard.jsx';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getHotspotAlerts } from '../utils/dataProcessor.js';

const AlertsPage = () => {
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const keralaCenter = [10.8505, 76.2711];

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getHotspotAlerts();
      setHotspots(data);
      setIsLoading(false);
    };
    fetchData();
  }, []); // Empty array ensures this runs only once

  const getSeverityColor = (severity) => {
    if (severity === 'red') return '#C62828';
    if (severity === 'orange') return '#FB8C00';
    return '#2E7D32';
  };

  const getSeverityClasses = (severity) => {
    if (severity === 'red') return 'bg-red-100 text-red-700';
    if (severity === 'orange') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };
  
  if (isLoading) {
    return <DashboardCard title="Loading Alerts...">Please wait...</DashboardCard>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Alerts & Hotspots</h2>
      <DashboardCard className="mb-6">
         <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Kerala Hotspot Map</h3>
            <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-alert-red mr-2"></div>Severe</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-alert-orange mr-2"></div>Moderate</span>
            </div>
        </div>
        <div className="h-[450px] w-full rounded-lg overflow-hidden">
            <MapContainer center={keralaCenter} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {hotspots.map(spot => (
                    <CircleMarker 
                        key={spot.id}
                        center={spot.position} 
                        radius={Math.sqrt(spot.cases) * 4} // Increased radius for visibility
                        pathOptions={{ color: getSeverityColor(spot.severity), fillColor: getSeverityColor(spot.severity), fillOpacity: 0.6 }}
                    >
                        <Popup><strong>{spot.district}</strong><br />{spot.cases} active cases</Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
      </DashboardCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspots.map(spot => (
            <Link to={`/migrants/by-location/${spot.id}?filter=at-risk`} key={spot.id} className="block hover:scale-105 transition-transform duration-200">
                <DashboardCard>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">{spot.district}</p>
                            <p className="text-3xl font-bold my-2">{spot.cases.toLocaleString()} <span className="text-lg font-normal text-gray-500">cases</span></p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full capitalize ${getSeverityClasses(spot.severity)}`}>{spot.severity}</span>
                    </div>
                    <p className="text-sm text-gray-500">Threshold: {spot.threshold} cases</p>
                </DashboardCard>
            </Link>
          ))}
      </div>
      {hotspots.length === 0 && <DashboardCard><p className="text-center">No active alerts at the moment.</p></DashboardCard>}
    </div>
  );
};

export default AlertsPage;