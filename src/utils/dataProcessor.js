const API_BASE_URL = 'http://localhost:5000/api';

// --- Central functions to fetch data ---
async function fetchAllLocations() {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error('Failed to fetch locations');
    return response.json();
}

async function fetchAllMigrants() {
    const response = await fetch(`${API_BASE_URL}/migrants`);
    if (!response.ok) throw new Error('Failed to fetch migrants');
    return response.json();
}

// --- Main Data Fetching Functions for Your Pages ---

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
  const districts = new Set(migrants.map(m => m.district));
  return ['All Districts', ...Array.from(districts)];
};

export const getLocationsByDistrict = async (district) => {
  if (!district || district === 'All Districts') {
    return ['All Locations'];
  }
  const response = await fetch(`${API_BASE_URL}/migrants`);
  if (!response.ok) throw new Error('Failed to fetch migrants for locations');
  const migrants = await response.json();
  const locations = new Set(migrants.filter(m => m.district === district).map(m => m.city));
  return ['All Locations', ...Array.from(locations)];
};

export const getCasesByLocation = async (district) => {
    const response = await fetch(`${API_BASE_URL}/migrants`);
    if(!response.ok) return [];
    const allMigrants = await response.json();
    const migrantsInDistrict = allMigrants.filter(m => m.district === district);

    const casesByLocationMap = {};
    migrantsInDistrict.forEach(migrant => {
        if (migrant.health_profile?.overall_status !== 'Healthy' && migrant.health_profile?.overall_status !== 'Recovered') {
            if (!casesByLocationMap[migrant.city]) {
                const locationKey = `${migrant.district}-${migrant.city}`;
                casesByLocationMap[migrant.city] = { name: migrant.city, cases: 0, id: locationKey };
            }
            casesByLocationMap[migrant.city].cases++;
        }
    });
    return Object.values(casesByLocationMap);
};

// --- THIS FUNCTION WAS MISSING ---
export const getMigrantsByFilter = async (filter) => {
  let url = `${API_BASE_URL}/migrants`;
  if (filter.status && filter.status !== 'all') {
    url += `?status=${filter.status}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch filtered migrants');
  let migrants = await response.json();

  // Further filter by location on the frontend if needed (since backend doesn't support it yet)
  if (filter.locationId) {
    migrants = migrants.filter(m => m.location_id === filter.locationId);
  }
  
  return migrants;
};
// --- END OF FIX ---

export const getMigrantByPhone = async (phone) => {
    const response = await fetch(`${API_BASE_URL}/migrants/${phone}`);
    if (!response.ok) return null;
    return response.json();
};

export const getHotspotAlerts = async () => {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
};