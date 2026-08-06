// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import MainLayout from './components/wrappers/MainLayout/MainLayout';
// // import Home from './components/screens/Home';
// // // import PlantDetail from './components/commons/PlantDetails/PlantDetails';
// // // import PlantDetails from './components/commons/PlantDetails/PlantDetails';
// // // import PlantDatabase from './components/screens/Home/PlantDetails';
// // import About from './components/screens/About';
// // import FacultySection from './components/screens/FacultyandStaff';
// // import ContactPage from './components/screens/Contact';
// // import PlantContributor from './components/screens/PlantContributor';
// // import Guidlines from './components/screens/Guidlines';
// // import PlantListing from './components/commons/PlantListing/PlantListing';
// // import PlantsListing from './components/screens/PlantListing';
// // import PlantDetails from './components/screens/PlantDetails';

// // // Dummy components for now
// // // const Home = () => <div className="p-10 text-center text-2xl">Search the Herbarium...</div>;
// // // const Contact = () => <div className="p-10 text-center">Contact Kew Gardens</div>;

// // function App() {
// //   return (
// //     <BrowserRouter>
// //     <Routes>
// //   <Route path="/" element={<MainLayout />}>
// //     {/* This makes Home show up when the user visits "/" */}
// //     <Route index element={<Home />} /> 
    
// //     <Route path="home" element={<Home />} />
// //     <Route path="about" element={<About />} />
// //     <Route path="listing" element={<PlantsListing />} />


// //     <Route path="plant-details" element={<PlantDetails />} />

// //     <Route path="faculty-and-staff" element={<FacultySection />} />
// //     <Route path="plant-contributor" element={<PlantContributor />} />
// //     <Route path="guidelines" element={<Guidlines />} />

// //     <Route path="contact" element={<ContactPage />} />
  
// // <Route path="/plant-details/:id" element={<PlantDetails />} />
// //   </Route>
// // </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;

// import { useEffect } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Provider, useDispatch, useSelector } from "react-redux";

// import store from "./store/store";
// import { loadUserThunk } from "./store/slices/authSlice";

// // Layout
// import MainLayout from "./components/wrappers/MainLayout/MainLayout";

// // Existing Screens
// import Home from "./components/screens/Home";
// import About from "./components/screens/About";
// import FacultySection from "./components/screens/FacultyandStaff";
// import ContactPage from "./components/screens/Contact";
// // import PlantContributor from "./components/screens/PlantContributor";
// // import Guidlines from "./components/screens/Guidlines";
// import PlantDetails from "./components/screens/PlantsListing/PlantDetails";
// import PlantsListing from './components/screens/PlantsListing/PlantListing';
// // New Auth Screens
// import LoginPage from "./components/screens/Login/Login";
// import BotanistApply from "./components/screens/Botanist/BotanistApply";

// // Route Guards
// import ProtectedRoute from "./routes/ProtectedRoute";
// import RoleBasedRoute from "./routes/RoleBasedRoute";
// import BotanistApplicationReview from "./components/screens/admin/Dashboard";
// import BotanistSidebar from "./components/commons/Sidebar/Sidebar";
// import Sidebar from "./components/commons/Sidebar/Sidebar";
// import BotanistDashboard from "./components/screens/Botanist/Dashboard";

// // ---------------------------------------------------
// // Session Restore
// // ---------------------------------------------------
// const AppInit = ({ children }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(loadUserThunk());
//   }, [dispatch]);

//   if (loading) return null;

//   return children;
// };

// // ---------------------------------------------------
// // Main Routes
// // ---------------------------------------------------
// const AppRoutes = () => {
//   return (
//     <AppInit>
//       <Routes>

//         {/* Public Layout Routes */}
//         <Route path="/" element={<MainLayout />}>
//           <Route index element={<Home />} />

//           <Route path="home" element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="listing" element={<PlantsListing />} />
//           <Route path="plant-details/:id" element={<PlantDetails />} />
//           <Route path="faculty-and-staff" element={<FacultySection />} />
//           {/* <Route path="plant-contributor" element={<PlantContributor />} /> */}
//           {/* <Route path="guidelines" element={<Guidlines />} /> */}
//           <Route path="contact" element={<ContactPage />} />
//         </Route>

//         {/* Auth Routes */}
//         <Route path="/login" element={<LoginPage />} />

//         <Route
//           path="/apply"
//           element={
//             // <ProtectedRoute>
//               <BotanistApply />
//             // </ProtectedRoute>
//           }
//         />

//         {/* Admin Routes */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <RoleBasedRoute allowedRoles={["admin"]}>
//             <BotanistApplicationReview/>
//             </RoleBasedRoute>
//           }
//         />

//         {/* Botanist Routes */}
//         <Route
//           path="/botanist/dashboard"
//           element={
//             <RoleBasedRoute allowedRoles={["botanist"]}>
//              <BotanistDashboard/>
//             </RoleBasedRoute>
//           }
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </AppInit>
//   );
// };

// // ---------------------------------------------------
// // Root App
// // ---------------------------------------------------
// function App() {
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store/store";
import { loadUserThunk } from "./store/slices/authSlice";

// Layouts
import MainLayout from "./components/wrappers/MainLayout/MainLayout";
import BotanistLayout from "./components/screens/Botanist/BotanistLayout"; // <--- Add your BotanistLayout import

// Existing Screens
import Home from "./components/screens/Home";
import About from "./components/screens/About";
import FacultySection from "./components/screens/FacultyandStaff";
import ContactPage from "./components/screens/Contact";
import PlantDetails from "./components/screens/PlantsListing/PlantDetails";
import PlantsListing from './components/screens/PlantsListing/PlantListing';

// Auth & Admin Screens
import LoginPage from "./components/screens/Login/Login";
import BotanistApply from "./components/screens/Botanist/BotanistApply";
import BotanistApplicationReview from "./components/screens/admin/Dashboard";

// Botanist Sub-Screens
import BotanistProfile from "./components/screens/Botanist/BotanistProfile";
// Import other botanist pages as you build them:
// import BotanistDashboardOverview from "./components/screens/Botanist/BotanistDashboardOverview";
// import NewSubmission from "./components/screens/Botanist/NewSubmission";
// import MySubmissions from "./components/screens/Botanist/MySubmissions";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleBasedRoute from "./routes/RoleBasedRoute";

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

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <BotanistApplicationReview />
            </RoleBasedRoute>
          }
        />

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

          {/* Child pages that display inside <Outlet /> */}
          <Route path="profile" element={<BotanistProfile />} />
          
          {/* Placeholders for remaining sidebar items */}
          <Route path="dashboard" element={<div>Botanist Overview Dashboard</div>} />
          <Route path="new-submission" element={<div>New Specimen Submission Form</div>} />
          <Route path="my-submissions" element={<div>Botanist Submissions Table</div>} />
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