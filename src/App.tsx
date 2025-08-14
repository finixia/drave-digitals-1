import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserRegistration from './pages/UserRegistration';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <UserLogin />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<UserLogin />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;