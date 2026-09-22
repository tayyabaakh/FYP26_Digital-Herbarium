import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store/store";
import { loadUserThunk } from "./store/slices/authSlice";

// Layouts
import MainLayout from "./components/wrappers/MainLayout/MainLayout";
import BotanistLayout from "./components/screens/Botanist/BotanistLayout";
import AdminLayout from "./components/screens/admin/AdminLayout"; // <--- Admin Layout Import

// Public & General Screens
import Home from "./components/screens/Home";
import About from "./components/screens/About";
import FacultySection from "./components/screens/FacultyandStaff";
import ContactPage from "./components/screens/Contact";
import PlantDetails from "./components/screens/PlantsListing/PlantDetails";
import PlantsListing from "./components/screens/PlantsListing/PlantListing";

// Auth Screens
import LoginPage from "./components/screens/Login/Login";
import BotanistApply from "./components/screens/Botanist/BotanistApply";

// Botanist Sub-Screens
import BotanistDashboard from "./components/screens/Botanist/BotanistDashboard";
import BotanistNewSubmission from "./components/screens/Botanist/BotanistNewSubmission/BotanistNewSubmission";
import MySubmissions from "./components/screens/Botanist/BotanistNewSubmission/MySubmissions/MySubmissions";

// Admin Sub-Screens (Import/Create these components in your project)
import BotanistApplicationReview from "./components/screens/admin/Dashboard";
// import PendingVerifications from "./components/screens/admin/PendingVerifications";
// import HerbariumDatabase from "./components/screens/admin/HerbariumDatabase";
// import UserManagement from "./components/screens/admin/UserManagement";
// import AuditLogs from "./components/screens/admin/AuditLogs";
// import AdminSettings from "./components/screens/admin/AdminSettings";
// import AdminProfile from "./components/screens/admin/AdminProfile";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import Dashboard from "./components/screens/admin/Dashboard";
import Applications from "./components/screens/admin/Applications";
import UserProfile from "./components/screens/profile/userProfile";
import VerificationCenter from "./components/screens/admin/Verification";

// ---------------------------------------------------
// Session Restore
// ---------------------------------------------------
const AppInit = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  if (loading) return null;

  return children;
};

// ---------------------------------------------------
// Main Routes
// ---------------------------------------------------
const AppRoutes = () => {
  return (
    <AppInit>
      <Routes>
        {/* Public Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="listing" element={<PlantsListing />} />
          <Route path="plant-details/:id" element={<PlantDetails />} />
          <Route path="faculty-and-staff" element={<FacultySection />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/apply" element={<BotanistApply />} />

        {/* --------------------------------------------------- */}
        {/* Admin Portal Nested Routes */}
        {/* --------------------------------------------------- */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          {/* Default redirect: /admin -> /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Child sub-routes rendered within AdminLayout's <Outlet /> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="application" element={<Applications />} />
          <Route path="verification" element={<VerificationCenter />} />

          {/* <Route path="herbarium-records" element={<HerbariumDatabase />} /> */}
          {/* <Route path="settings" element={<AdminSettings />} /> */}
          {/* <Route path="profile" element={<AdminProfile />} /> */}
        </Route>

        {/* --------------------------------------------------- */}
        {/* Botanist Portal Nested Routes */}
        {/* --------------------------------------------------- */}
        <Route
          path="/botanist"
          element={
            <RoleBasedRoute allowedRoles={["botanist"]}>
              <BotanistLayout />
            </RoleBasedRoute>
          }
        >
          {/* Default redirect: /botanist -> /botanist/profile */}
          <Route index element={<Navigate to="/botanist/profile" replace />} />

          {/* Child sub-routes rendered within BotanistLayout's <Outlet /> */}
          <Route path="dashboard" element={<BotanistDashboard />} />
          <Route path="new-submission" element={<BotanistNewSubmission />} />
          <Route path="my-submissions" element={<MySubmissions />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppInit>
  );
};

// ---------------------------------------------------
// Root App
// ---------------------------------------------------
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