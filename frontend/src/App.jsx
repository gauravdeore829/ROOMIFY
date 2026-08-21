import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';

// Public Pages
import Home from './pages/Public/Home';
import SearchPage from './pages/Public/Search';
import PropertyDetails from './pages/Public/PropertyDetails';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import About from './pages/Public/About';
import Contact from './pages/Public/Contact';

// User Dashboard Pages
import UserDashboard from './pages/User/UserDashboard';
import UserProfile from './pages/User/UserProfile';
import SavedRooms from './pages/User/SavedRooms';
import Applications from './pages/User/Applications';
import Notifications from './pages/User/Notifications';
import CompareRooms from './pages/User/CompareRooms';

// Owner Dashboard Pages
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import ManageProperties from './pages/Owner/ManageProperties';
import AddEditProperty from './pages/Owner/AddEditProperty';
import OwnerApplications from './pages/Owner/OwnerApplications';
import OwnerVerification from './pages/Owner/OwnerVerification';

// Admin Dashboard Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageVerifications from './pages/Admin/ManageVerifications';
import ManageReports from './pages/Admin/ManageReports';

// Public Layout Wrapper
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-slate-950">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Dashboard Layout Wrapper
const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-sky-400 font-bold text-lg">
        Authenticating RoomEase session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-grow max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* User Dashboard Routes */}
            <Route path="/user" element={<DashboardLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="saved" element={<SavedRooms />} />
              <Route path="applications" element={<Applications />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="compare" element={<CompareRooms />} />
            </Route>

            {/* Owner Dashboard Routes */}
            <Route path="/owner" element={<DashboardLayout />}>
              <Route index element={<OwnerDashboard />} />
              <Route path="properties" element={<ManageProperties />} />
              <Route path="properties/add" element={<AddEditProperty />} />
              <Route path="applications" element={<OwnerApplications />} />
              <Route path="verification" element={<OwnerVerification />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="verifications" element={<ManageVerifications />} />
              <Route path="reports" element={<ManageReports />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
