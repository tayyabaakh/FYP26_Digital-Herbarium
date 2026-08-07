/**
 * RoleBasedRoute
 * Wraps ProtectedRoute and adds role checking.
 * Usage:
 *   <RoleBasedRoute allowedRoles={['admin']}>
 *     <AdminDashboard />
 *   </RoleBasedRoute>
 */

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    // <ProtectedRoute>
      user && allowedRoles.includes(user.role) ? (
        children
      ) : (
        // Logged in but wrong role — send to their correct home
        <Navigate
          to={
            user?.role === 'admin'     ? '/admin/dashboard'    :
            user?.role === 'botanist'  ? '/botanist/dashboard' :
            '/'
          }
          replace
        />
      )
    //  </ProtectedRoute>
  );
};

export default RoleBasedRoute;