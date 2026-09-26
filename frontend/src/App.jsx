import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store/store";
import { loadUserThunk } from "./store/slices/authSlice";

// Layouts
import MainLayout from "./components/wrappers/MainLayout/MainLayout";
import BotanistLayout from "./components/screens/Botanist/BotanistLayout";
import AdminLayout from "./components/screens/admin/AdminLayout";

// Public screens
import Home from "./components/screens/Home";
import About from "./components/screens/About";
import FacultySection from "./components/screens/FacultyandStaff";
import ContactPage from "./components/screens/Contact";
import PlantDetails from "./components/screens/PlantsListing/PlantDetails";
import PlantsListing from "./components/screens/PlantsListing/PlantListing";

// Auth
import LoginPage from "./components/screens/Login/Login";
import BotanistApply from "./components/screens/Botanist/BotanistApply";
import ForgotPasswordPage from "./components/screens/Login/ForgotPassword";
import ResetPasswordPage from "./components/screens/Login/ResetPassword";

// Botanist
import BotanistDashboard from "./components/screens/Botanist/BotanistDashboard";
import BotanistNewSubmission from "./components/screens/Botanist/BotanistNewSubmission/BotanistNewSubmission";
import MySubmissions from "./components/screens/Botanist/BotanistNewSubmission/MySubmissions/MySubmissions";

// Admin
import Dashboard from "./components/screens/admin/Dashboard";
import Applications from "./components/screens/admin/Applications";
import VerificationCenter from "./components/screens/admin/Verification";
import HerbariumRecords from "./components/screens/admin/Herbarium_data";

// Profile
import UserProfile from "./components/screens/profile/userProfile";

// Guards
import RoleBasedRoute from "./routes/RoleBasedRoute";
import PublicOnlyRoute from "./routes/PublicRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============================================================
// SESSION INITIALIZATION
// ============================================================
const AppInit = ({ children }) => {
  const dispatch = useDispatch();

  const initializing = useSelector((state) => state.auth.initializing);

  useEffect(() => {
    const token = localStorage.getItem("token");

    /*
     * Only restore a session if a token actually exists.
     *
     * This prevents unnecessary loadUserThunk calls on
     * every fresh visit to the login page.
     */
    if (token) {
      dispatch(loadUserThunk());
    }
  }, [dispatch]);

  if (initializing) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
          fontFamily: "sans-serif",
          color: "#0f5132",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #0f5132",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "16px",
          }}
        />

        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }

              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>

        <p
          style={{
            fontSize: "14px",
            fontWeight: "500",
            margin: 0,
          }}
        >
          Restoring session...
        </p>
      </div>
    );
  }

  return children;
};

// ============================================================
// ROUTES
// ============================================================
const AppRoutes = () => {
  return (
    <AppInit>
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      <Routes>
        
        {/* PUBLIC */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="listing" element={<PlantsListing />} />
          <Route path="plant-details/:id" element={<PlantDetails />} />
          <Route path="faculty-and-staff" element={<FacultySection />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* AUTH */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/apply"
          element={
            <PublicOnlyRoute>
              <BotanistApply />
            </PublicOnlyRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="application" element={<Applications />} />

          <Route path="verification" element={<VerificationCenter />} />

          <Route path="herbarium-records" element={<HerbariumRecords />} />

          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* BOTANIST */}
        <Route
          path="/botanist"
          element={
            <RoleBasedRoute allowedRoles={["botanist"]}>
              <BotanistLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="/botanist/profile" replace />} />

          <Route path="dashboard" element={<BotanistDashboard />} />

          <Route path="new-submission" element={<BotanistNewSubmission />} />

          <Route path="my-submissions" element={<MySubmissions />} />

          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppInit>
  );
};

// ============================================================
// ROOT
// ============================================================
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
