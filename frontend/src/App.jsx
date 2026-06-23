// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import MainLayout from './components/wrappers/MainLayout/MainLayout';
// import Home from './components/screens/Home';
// // import PlantDetail from './components/commons/PlantDetails/PlantDetails';
// // import PlantDetails from './components/commons/PlantDetails/PlantDetails';
// // import PlantDatabase from './components/screens/Home/PlantDetails';
// import About from './components/screens/About';
// import FacultySection from './components/screens/FacultyandStaff';
// import ContactPage from './components/screens/Contact';
// import PlantContributor from './components/screens/PlantContributor';
// import Guidlines from './components/screens/Guidlines';
// import PlantListing from './components/commons/PlantListing/PlantListing';
// import PlantsListing from './components/screens/PlantListing';
// import PlantDetails from './components/screens/PlantDetails';

// // Dummy components for now
// // const Home = () => <div className="p-10 text-center text-2xl">Search the Herbarium...</div>;
// // const Contact = () => <div className="p-10 text-center">Contact Kew Gardens</div>;

// function App() {
//   return (
//     <BrowserRouter>
//     <Routes>
//   <Route path="/" element={<MainLayout />}>
//     {/* This makes Home show up when the user visits "/" */}
//     <Route index element={<Home />} /> 
    
//     <Route path="home" element={<Home />} />
//     <Route path="about" element={<About />} />
//     <Route path="listing" element={<PlantsListing />} />


//     <Route path="plant-details" element={<PlantDetails />} />

//     <Route path="faculty-and-staff" element={<FacultySection />} />
//     <Route path="plant-contributor" element={<PlantContributor />} />
//     <Route path="guidelines" element={<Guidlines />} />

//     <Route path="contact" element={<ContactPage />} />
  
// <Route path="/plant-details/:id" element={<PlantDetails />} />
//   </Route>
// </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store/store";
import { loadUserThunk } from "./store/slices/authSlice";

// Layout
import MainLayout from "./components/wrappers/MainLayout/MainLayout";

// Existing Screens
import Home from "./components/screens/Home";
import About from "./components/screens/About";
import FacultySection from "./components/screens/FacultyandStaff";
import ContactPage from "./components/screens/Contact";
import PlantContributor from "./components/screens/PlantContributor";
import Guidlines from "./components/screens/Guidlines";
import PlantsListing from "./components/screens/PlantListing";
import PlantDetails from "./components/screens/PlantDetails";

// New Auth Screens
import LoginPage from "./components/screens/Login";
import BotanistApply from "./components/screens/BotanistApply";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import BotanistApplicationReview from "./components/screens/admin/Dashboard";

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
          <Route path="plant-contributor" element={<PlantContributor />} />
          <Route path="guidelines" element={<Guidlines />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/apply"
          element={
            // <ProtectedRoute>
              <BotanistApply />
            // </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
            <BotanistApplicationReview/>
            </RoleBasedRoute>
          }
        />

        {/* Botanist Routes */}
        <Route
          path="/botanist/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["botanist"]}>
              <div style={{ padding: "40px" }}>
                <h1>Botanist Dashboard</h1>
                <p>Replace with BotanistDashboard component</p>
              </div>
            </RoleBasedRoute>
          }
        />

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