const API_BASE_URL = 'http://localhost:5000/api';

// --- Central functions to fetch all data from the backend ---
// We'll add a simple cache to prevent fetching the same data multiple times on one page load.
let locationsCache = null;
let migrantsCache = null;

async function fetchAllLocations() {
    if (locationsCache) return locationsCache;
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error('Failed to fetch locations');
    locationsCache = await response.json();
    return locationsCache;
}

async function fetchAllMigrants() {
    if (migrantsCache) return migrantsCache;
    const response = await fetch(`${API_BASE_URL}/migrants`);
    if (!response.ok) throw new Error('Failed to fetch migrants');
    migrantsCache = await response.json();
    return migrantsCache;
}

// --- All functions are now ASYNC and use live data ---

export const getUniqueDistricts = async () => {
  const locations = await fetchAllLocations();
  if (!locations || !Array.isArray(locations)) return [];
  const districts = new Set(locations.map(loc => loc.district));
  return ['All Districts', ...Array.from(districts)];
};

export const getLocationsByDistrict = async (district) => {
  const locations = await fetchAllLocations();
  if (!locations || !Array.isArray(locations)) return [];
  if (!district || district === 'All Districts') {
    return ['All Locations'];
  }
  const filteredLocations = locations
    .filter(loc => loc.district === district)
    .map(loc => loc.location);
  return ['All Locations', ...filteredLocations];
};

export const getDashboardKPIs = async (filters = {}) => {
  const locations = await fetchAllLocations();
  if (!locations || !Array.isArray(locations)) return { totalMigrants: 0, activeCases: 0, hotspots: 0, recovered: 0 };
  
  let data = locations;
  if (filters.district && filters.district !== 'All Districts') {
    data = data.filter(loc => loc.district === filters.district);
  }
  if (filters.location && filters.location !== 'All Locations') {
    data = data.filter(loc => loc.location === filters.location);
  }

  const totalMigrants = data.reduce((sum, loc) => sum + loc.migrants_count, 0);
  const activeCases = data.reduce((sum, loc) => sum + loc.cases_last_7_days, 0);
  const hotspots = data.filter(loc => loc.severity === 'red').length;
  return { totalMigrants, activeCases, hotspots, recovered: 118502 }; // Recovered is static for now
};

export const getCasesByDistrict = async (filters = {}) => {
    const locations = await fetchAllLocations();
    let data = locations;
    if (filters.district && filters.district !== 'All Districts') {
        data = data.filter(loc => loc.district === filters.district);
    }
    const districtMap = {};
    data.forEach(loc => {
        if (!districtMap[loc.district]) districtMap[loc.district] = 0;
        districtMap[loc.district] += loc.cases_last_7_days;
    });
    return Object.keys(districtMap).map(d => ({ name: d, cases: districtMap[d] }));
};

export const getCasesByLocation = async (district) => {
  const locations = await fetchAllLocations();
  return locations
    .filter(loc => loc.district === district)
    .map(loc => ({
      name: loc.location,
      cases: loc.cases_last_7_days,
      id: loc.id
    }));
};

export const getDiseaseTypes = async (filters = {}) => {
    const locations = await fetchAllLocations();
    let data = locations;
    if (filters.district && filters.district !== 'All Districts') {
        data = data.filter(loc => loc.district === filters.district);
    }
    const diseaseMap = {};
    data.forEach(loc => {
        if (!diseaseMap[loc.primary_disease]) diseaseMap[loc.primary_disease] = 0;
        diseaseMap[loc.primary_disease] += loc.cases_last_7_days;
    });
    return Object.keys(diseaseMap).map(d => ({ name: d, value: diseaseMap[d] }));
};

export const getHotspotAlerts = async () => {
    const migrants = await fetchAllMigrants();
    const locations = await fetchAllLocations();
    if (!migrants.length || !locations.length) return [];
    const casesByLocation = {};
    migrants.forEach(migrant => {
        if (migrant.health_profile && migrant.health_profile.overall_status !== 'Healthy') {
            if (!casesByLocation[migrant.location_id]) casesByLocation[migrant.location_id] = 0;
            casesByLocation[migrant.location_id]++;
        }
    });
    const alerts = Object.keys(casesByLocation).map(locIdStr => {
        const locId = parseInt(locIdStr);
        const locData = locations.find(l => l.id === locId);
        if (!locData) return null;
        const cases = casesByLocation[locId];
        return {
            id: locData.id,
            position: [locData.lat, locData.lng],
            district: locData.location,
            cases: cases,
            severity: cases >= 2 ? 'red' : 'orange',
            threshold: 2,
        };
    });
    return alerts.filter(a => a !== null);
};

export const getMigrantsByFilter = async (filter) => {
  const allMigrants = await fetchAllMigrants();
  const allLocations = await fetchAllLocations();
  let filteredMigrants = allMigrants;
  if (filter.locationId) {
    filteredMigrants = allMigrants.filter(m => m.location_id === filter.locationId);
  } else if (filter.districtName) {
    const locationIdsInDistrict = allLocations
      .filter(l => l.district === filter.districtName)
      .map(l => l.id);
    filteredMigrants = allMigrants.filter(m => locationIdsInDistrict.includes(m.location_id));
  }
  if (filter.status === 'at-risk') {
    return filteredMigrants.filter(m => m.health_profile && m.health_profile.overall_status !== 'Healthy');
  }
  return filteredMigrants;
};

export const getMigrantByPhone = async (phone) => {
    const response = await fetch(`${API_BASE_URL}/migrants/${phone}`);
    if (!response.ok) return null;
    const migrant = await response.json();
    const locations = await fetchAllLocations();
    const locationDetails = locations.find(l => l.district === migrant.district && l.city === migrant.city);
    return { ...migrant, locationDetails: locationDetails || {} };
};