import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Layout from './components/Layout'
import VehicleList from './pages/VehicleList'
import ServiceList from './pages/ServiceList'
import LoginForm from './components/LoginForm'

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on startup
    const token = localStorage.getItem('authToken');
    const isValid = token && !isTokenExpired(token);
    
    if (isValid) {
      // Set up axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // Memoize authentication state to prevent unnecessary re-renders
  const authContext = useMemo(() => ({
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
  }), [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginForm onLogin={authContext.login} />
          } 
        />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout onLogout={authContext.logout}>
                <Routes>
                  <Route path="/" element={<VehicleList />} />
                  <Route path="/services" element={<ServiceList />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  )
}

export default App