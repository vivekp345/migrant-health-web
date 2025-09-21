import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout and Pages
import Layout from './components/Layout.jsx';
import SplashScreen from './pages/SplashScreen.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import SearchMigrantsPage from './pages/SearchMigrantsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MigrantListPage from './pages/MigrantListPage.jsx';
import MigrantDetailPage from './pages/MigrantDetailPage.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes - These do not have the sidebar/navbar */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes Wrapper
        All routes nested inside here will share the same Layout (Sidebar + Navbar).
        This is the new, simplified structure.
      */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/alerts" element={<AlertsPage />} />
        <Route path="/dashboard/migrants" element={<SearchMigrantsPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        
        {/* The migrant pages are now correctly placed inside the main layout */}
        <Route path="/migrants/list/:filterType" element={<MigrantListPage />} /> {/* e.g., /migrants/list/active */}
        <Route path="/migrants/by-district/:districtName" element={<MigrantListPage />} />
        <Route path="/migrants/by-location/:locationId" element={<MigrantListPage />} />
        <Route path="/migrants/details/:phone" element={<MigrantDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;