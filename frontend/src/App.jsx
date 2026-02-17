import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/wrappers/MainLayout/MainLayout';
import Home from './components/screens/Home/Home';
import PlantDetail from './components/commons/PlantDetails/PlantDetails';

// Dummy components for now
// const Home = () => <div className="p-10 text-center text-2xl">Search the Herbarium...</div>;
const Contact = () => <div className="p-10 text-center">Contact Kew Gardens</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside this will have the Header and Footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="plantdetail" element={<PlantDetail/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;