
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../../api/plantApi';
import SpecimenCard from '../../commons/SpecimanCard/specimancard';
import LoadingScreen from '../../commons/Loader/Loader';

export default function PlantsListing() {
  const navigate = useNavigate();

  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const initialFilters = {
    collection_folder: '',
    collection_no: '',
    collector_group_members: '',
    collector_name: '',
    date: '',
    family: '',
    flower_color: '',
    habit: '',
    habitat: '',
    locality: '',
    location_code: '',
    name: '',
    species: '',
    specimen_folder: '',
    specimen_id_gh_number: ''
  };

  const [filters, setFilters] = useState(initialFilters);

  // helper: safely convert any value to lowercase string
  const normalizeValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase().trim();
  };

  // 1) Fetch plants and create a stable unique key for React rendering
  useEffect(() => {
    const getPlantsData = async () => {
      try {
        const response = await fetchPlants();
        const actualData = response?.data || response || [];

        const plantsWithKeys = actualData.map((plant, index) => ({
          ...plant,
          _uiKey: [
            plant.specimen_id_gh_number ?? 'no-specimen-id',
            plant.collection_no ?? 'no-collection-no',
            plant.location_code ?? 'no-location-code',
            plant.collector_name ?? 'no-collector',
            index
          ].join('-')
        }));

        setPlants(plantsWithKeys);
        setFilteredPlants(plantsWithKeys);
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };

    getPlantsData();
  }, []);

  // 2) Filter plants whenever filters or plants change
  useEffect(() => {
    const results = plants.filter((plant) => {
      return Object.keys(filters).every((key) => {
        const filterValue = normalizeValue(filters[key]);

        // If user has not typed anything in this field, skip filtering for this field
        if (!filterValue) return true;

        const plantValue = normalizeValue(plant[key]);

        // Prefix match: startsWith
        return plantValue.startsWith(filterValue);
      });
    });

    setFilteredPlants(results);
  }, [filters, plants]);

  // 3) Update filter state
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 4) Reset all filters
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="font-body-md text-on-background min-h-screen pb-24 bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950">
      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Filter drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-amber-50 z-[110] p-6 shadow-2xl transition-transform duration-300 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-black">Search Filters</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-black text-xl"
          >
            ✕
          </button>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-2 mb-6 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition"
        >
          Reset All
        </button>

        <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-1">
          {Object.keys(initialFilters).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-700 mb-1">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="text"
                name={key}
                value={filters[key]}
                onChange={handleFilterChange}
                placeholder={`Filter by ${key.replace(/_/g, ' ')}`}
                className="border border-gray-300 rounded p-2 text-black outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="pt-24 px-6 max-w-[1440px] mx-auto">
        <section className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold uppercase mb-2 text-amber-50">
              Botanical Records
            </h1>
            <p className="text-amber-50">
              Showing {filteredPlants.length} specimens.
            </p>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-amber-50 text-black px-4 py-2 rounded-lg font-bold hover:bg-amber-100 transition shrink-0 w-full sm:w-auto justify-center sm:justify-start"
          >
            <span>☰</span> Filters
          </button>
        </section>

        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.map((plant) => (
              <div
                key={plant._uiKey}
                onClick={() =>
                  navigate(`/plant-details/${plant.specimen_id_gh_number}`)
                }
                className="cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
              >
                <SpecimenCard
                  title={plant.name || 'Unknown Plant'}
                  type={plant.family || 'Unknown Family'}
                  species={plant.species || 'Unknown Species'}
                  author={plant.author || 'Unknown Author'}
                  collector={plant.collector_name || 'Unknown Collector'}
                  locality={plant.locality || 'Unknown Locality'}
                  img={
                    plant.image_url 
                    
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-20">
            <p className="text-white font-medium text-lg">
              No plants match your selected filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}