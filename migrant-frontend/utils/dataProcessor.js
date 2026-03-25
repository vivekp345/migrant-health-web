const API_BASE_URL = 'http://localhost:5000/api';

export async function getDashboardData(filters = {}) {
    let url = `${API_BASE_URL}/dashboard-stats`;
    if (filters.district && filters.district !== 'All Districts') {
        url += `?district=${encodeURIComponent(filters.district)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
}

export const getUniqueDistricts = async () => {
  const response = await fetch(`${API_BASE_URL}/migrants`);
  if (!response.ok) throw new Error('Failed to fetch migrants for districts');
  const migrants = await response.json();
  const districts = new Set(migrants.map(m => m.district).filter(Boolean));
  return ['All Districts', ...Array.from(districts)];
};

export const getLocationsByDistrict = async (district) => {
  if (!district || district === 'All Districts') {
    return ['All Locations'];
  }
  const response = await fetch(`${API_BASE_URL}/migrants?district=${encodeURIComponent(district)}`);
  if (!response.ok) throw new Error('Failed to fetch migrants for locations');
  const migrants = await response.json();
  const locations = new Set(migrants.map(m => m.city).filter(Boolean));
  return ['All Locations', ...Array.from(locations)];
};

export const getCasesByLocation = async (district) => {
    const response = await fetch(`${API_BASE_URL}/migrants?district=${encodeURIComponent(district)}`);
    if(!response.ok) return [];
    const migrantsInDistrict = await response.json();

    const casesByLocationMap = {};
    migrantsInDistrict.forEach(migrant => {
        if (migrant.health_profile?.overall_status !== 'Healthy' && migrant.health_profile?.overall_status !== 'Recovered') {
            if (migrant.city) {
                if (!casesByLocationMap[migrant.city]) {
                    casesByLocationMap[migrant.city] = { name: migrant.city, cases: 0, id: migrant.city };
                }
                casesByLocationMap[migrant.city].cases++;
            }
        }
    });
    return Object.values(casesByLocationMap);
};

export const getMigrantsByFilter = async (filter) => {
  const params = new URLSearchParams();
  if (filter.status) {
    params.append('status', filter.status);
  }
  if (filter.districtName) {
    params.append('district', filter.districtName);
  }
  
  const response = await fetch(`${API_BASE_URL}/migrants?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch filtered migrants');
  return response.json();
};

// --- THIS FUNCTION IS NOW CORRECTLY INCLUDED ---
export const getMigrantByPhone = async (phone) => {
    const response = await fetch(`${API_BASE_URL}/migrants/${phone}`);
    if (!response.ok) return null;
    return response.json();
};
// --- END OF FIX ---

export const getHotspotAlerts = async () => {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
};