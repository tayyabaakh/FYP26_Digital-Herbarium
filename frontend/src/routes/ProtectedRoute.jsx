import { useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    initializing,
  } = useSelector((state) => state.auth);

  const location = useLocation();

  // Wait only for session restoration
  if (initializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <p
          style={{
            color: "#2d6a4f",
            fontWeight: 600,
          }}
        >
          Restoring session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;