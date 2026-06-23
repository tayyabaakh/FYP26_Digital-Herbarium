

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/plantApi'; // Ensure this path is correct
import Header from '../commons/Header/Header';
import SpecimenCard from '../commons/PlantListing/specimancard';
import LoadingScreen from '../commons/Loader/Loader';

export default function PlantsListing() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const initialFilters = {
        collection_folder: '', collection_no: '', collector_group_members: '',
        collector_name: '', date: '', family: '', flower_color: '',
        habit: '', habitat: '', locality: '', location_code: '',
        name: '', species: '', specimen_folder: '', specimen_id_gh_number: ''
    };
  const [filters, setFilters] = useState(initialFilters);

  // 1. Fetch Data
  useEffect(() => {
    const getPlantsData = async () => {
      try {
        const response = await fetchPlants();
        const actualData = response.data || response;
        setPlants(actualData);
        setFilteredPlants(actualData);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };
    getPlantsData();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    const results = plants.filter(plant => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true;
        return String(plant[key] || '').toLowerCase().includes(filters[key].toLowerCase());
      });
    });
    setFilteredPlants(results);
  }, [filters, plants]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => setFilters({ ...initialFilters });

  if (loading) return <LoadingScreen/>;

  return (
    <div className="font-body-md text-on-background min-h-screen pb-24 bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950">
      {/* <Header  onMenuToggle={() => setIsDrawerOpen(true)} /> */}
   

      {/* Filter Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Filter Drawer */}
      <div className={`fixed bg-amber-50 top-0 right-0 h-full w-80 bg-surface-container z-[110] p-6 shadow-2xl transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold">Search Filters</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-on-background">✕</button>
        </div>
        
        <button onClick={resetFilters} className="w-full py-2 mb-6 bg-error text-on-error rounded font-bold">Reset All</button>

        <div className="space-y-4 overflow-y-auto max-h-[80vh]">
          {Object.keys(initialFilters).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-xs font-bold uppercase text-on-surface-variant mb-1">{key.replace(/_/g, ' ')}</label>
              <input
                name={key}
                value={filters[key]}
                onChange={handleFilterChange}
                placeholder={`Filter by ${key}`}
                className="bg-surface-dim border border-outline rounded p-2 text-on-background"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-[1440px] mx-auto">
    <section className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
  {/* Left Side: Text Details */}
  <div>
    <h1 className="text-4xl font-bold uppercase mb-2 text-amber-50">Botanical Records</h1>
    <p className="text-on-tertiary-container text-amber-50">Showing {filteredPlants.length} specimens.</p>
  </div>

  {/* Right Side: Filter Button */}
  <button 
    onClick={() => setIsDrawerOpen(true)} 
    className="flex mr-15 bg-amber-50 items-center gap-2 text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-container transition shrink-0 w-full sm:w-auto justify-center sm:justify-start"
  >
    <span>☰</span> Filters
  </button>
</section>
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.map((plant) => (
              <div key={plant.specimen_id_gh_number} onClick={() => navigate(`/plant-details/${plant.specimen_id_gh_number}`)}>
                <SpecimenCard 
                  title={plant.name} 
                  type={plant.family} 
                  collector={plant.collector_name} 
                  locality={plant.locality} 
                  img={plant.image_url || "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400"} 
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white mt-20 text-on-surface-variant">No plants match your filters.</p>
        )}
      </main>
    </div>
  );
}