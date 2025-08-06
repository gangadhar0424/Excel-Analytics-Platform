import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/authSlice';
import { ThemeProvider } from './contexts/ThemeContext';
import ResponsiveNavbar from './components/ResponsiveNavbar';
import OnboardingTour from './components/OnboardingTour';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analyze from './pages/Analyze';
import Settings from './pages/Settings';

// Feature Pages
import DataCleaning from './pages/DataCleaning';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import Collaboration from './pages/Collaboration';
import ExportReporting from './pages/ExportReporting';
import DataIntegration from './pages/DataIntegration';
import UserExperience from './pages/UserExperience';
import SecurityCompliance from './pages/SecurityCompliance';
import Performance from './pages/Performance';
import Notifications from './pages/Notifications';
import AIFeatures from './pages/AIFeatures';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is new and hasn't completed onboarding
    if (user && !localStorage.getItem('onboardingCompleted')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300">
          {/* Responsive Navigation */}
          <ResponsiveNavbar user={user} onLogout={handleLogout} />
          
          {/* Main Content */}
          <div className="pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/upload" element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              } />
              <Route path="/analyze/:fileId" element={
                <PrivateRoute>
                  <Analyze />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              
              {/* Feature Routes */}
              <Route path="/data-cleaning" element={
                <PrivateRoute>
                  <DataCleaning />
                </PrivateRoute>
              } />
              <Route path="/advanced-analytics" element={
                <PrivateRoute>
                  <AdvancedAnalytics />
                </PrivateRoute>
              } />
              <Route path="/collaboration" element={
                <PrivateRoute>
                  <Collaboration />
                </PrivateRoute>
              } />
              <Route path="/export-reporting" element={
                <PrivateRoute>
                  <ExportReporting />
                </PrivateRoute>
              } />
              <Route path="/data-integration" element={
                <PrivateRoute>
                  <DataIntegration />
                </PrivateRoute>
              } />
              <Route path="/user-experience" element={
                <PrivateRoute>
                  <UserExperience />
                </PrivateRoute>
              } />
              <Route path="/security-compliance" element={
                <PrivateRoute>
                  <SecurityCompliance />
                </PrivateRoute>
              } />
              <Route path="/performance" element={
                <PrivateRoute>
                  <Performance />
                </PrivateRoute>
              } />
              <Route path="/notifications" element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              } />
              <Route path="/ai-features" element={
                <PrivateRoute>
                  <AIFeatures />
                </PrivateRoute>
              } />
            </Routes>
          </div>
          
          {/* Onboarding Tour */}
          <OnboardingTour 
            isOpen={showOnboarding}
            onClose={() => setShowOnboarding(false)}
            onComplete={handleOnboardingComplete}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
