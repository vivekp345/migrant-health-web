import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard.jsx';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getHotspotAlerts } from '../utils/dataProcessor.js';

const AlertsPage = () => {
  const [districtAlerts, setDistrictAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const keralaCenter = [10.8505, 76.2711];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getHotspotAlerts();
        setDistrictAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        setDistrictAlerts([]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getSeverityColor = (severity) => {
    if (severity === 'red') return '#C62828';
    return '#FB8C00';
  };

  const getSeverityClasses = (severity) => {
    if (severity === 'red') return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  if (isLoading) {
    return <DashboardCard title="Loading Live Alerts...">Please wait...</DashboardCard>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Districts with Active Cases</h2>
      {districtAlerts.length > 0 ? (
        <>
          <DashboardCard className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Hotspot Map (Districts)</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>Severe</span>
                <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>Moderate</span>
              </div>
            </div>
            <div className="h-[450px] w-full rounded-lg overflow-hidden">
              <MapContainer center={keralaCenter} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                {districtAlerts.map(alert => (
                  <CircleMarker
                    key={alert.district}
                    center={alert.position}
                    radius={Math.sqrt(alert.cases) * 8 + 5} // Radius based on total cases in district
                    pathOptions={{ color: getSeverityColor(alert.severity), fillColor: getSeverityColor(alert.severity), fillOpacity: 0.6 }}
                  >
                    <Popup><strong>{alert.district}</strong><br />{alert.cases} active case(s)</Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </DashboardCard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districtAlerts.map(alert => (
              <Link to={`/migrants/by-district/${alert.district}?filter=at-risk`} key={alert.district} className="block hover:scale-105 transition-transform duration-200">
                <DashboardCard>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-xl">{alert.district}</p>
                      <p className="text-3xl font-bold my-2">
                        {alert.cases.toLocaleString()}
                        <span className="text-lg font-normal text-gray-500"> active case(s)</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full capitalize ${getSeverityClasses(alert.severity)}`}>
                      View List
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Click to view at-risk individuals</p>
                </DashboardCard>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <DashboardCard>
          <p className="text-center text-gray-500 py-8">No active alerts at the moment. All districts are currently safe.</p>
        </DashboardCard>
      )}
    </div>
  );
};

export default AlertsPage;