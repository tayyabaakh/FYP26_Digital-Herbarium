/**
 * ProtectedRoute
 * Blocks access to any route that requires login.
 * Redirects to /login if no valid session exists.
 */

import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Still restoring session — show nothing yet
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5',
      }}>
        <p style={{ color: '#2d6a4f', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;