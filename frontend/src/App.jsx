import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/wrappers/MainLayout/MainLayout';
import Home from './components/screens/Home/Home';
import PlantDetail from './components/commons/PlantDetails/PlantDetails';
// import PlantDetails from './components/commons/PlantDetails/PlantDetails';
import PlantDatabase from './components/screens/Home/PlantDatabase';
import About from './components/screens/Home/About';
import FacultySection from './components/screens/Home/FacultyandStaff';
import ContactPage from './components/screens/Home/Contact';
import PlantContributor from './components/screens/Home/PlantContributor';
import Guidlines from './components/screens/Home/Guidlines';
import PlantListing from './components/commons/PlantListing/PlantListing';
import PlantsListing from './components/screens/Home/PlantsListing';

// Dummy components for now
// const Home = () => <div className="p-10 text-center text-2xl">Search the Herbarium...</div>;
// const Contact = () => <div className="p-10 text-center">Contact Kew Gardens</div>;

function App() {
  return (
    <BrowserRouter>
    <Routes>
  <Route path="/" element={<MainLayout />}>
    {/* This makes Home show up when the user visits "/" */}
    <Route index element={<Home />} /> 
    
    <Route path="home" element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="listing" element={<PlantsListing />} />


    <Route path="plant-database" element={<PlantDatabase />} />

    <Route path="faculty-and-staff" element={<FacultySection />} />
    <Route path="plant-contributor" element={<PlantContributor />} />
    <Route path="guidelines" element={<Guidlines />} />

    <Route path="contact" element={<ContactPage />} />
    <Route path="plantdetail" element={<PlantDetail/>} />
  </Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;