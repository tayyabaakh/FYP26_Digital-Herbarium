import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const {
    isAuthenticated,
    user,
    initializing,
  } = useSelector((state) => state.auth);

  // Wait ONLY while restoring an existing session
  if (initializing) {
    return null;
  }

  // Already authenticated
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (user.role === "botanist") {
      return (
        <Navigate
          to="/botanist/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default PublicOnlyRoute;