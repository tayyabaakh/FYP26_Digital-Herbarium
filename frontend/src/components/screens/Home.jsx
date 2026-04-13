import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/api';

const ForestSchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();

  // 1. Load data from API on component mount
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const response = await fetchPlants();
        // Adjust based on your API response structure
        const data = response.data || response;
        setPlants(data);
      } catch (err) {
        console.error("Failed to load plants for search", err);
      }
    };
    loadPlants();
  }, []);

  // 2. Filter logic for the dropdown suggestions
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const matches = plants
        .filter(p => 
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.family?.toLowerCase().includes(searchTerm.toLowerCase())
        )
       ; // Limiting results for a cleaner UI
      setFilteredSuggestions(matches);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm, plants]);

  // 3. Navigation handler for Search Button or Enter Key
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const matchedPlant = plants.find(
      (p) => p.name?.toLowerCase() === searchTerm.toLowerCase().trim()
    );

    if (matchedPlant) {
      navigate(`/plant-details/${matchedPlant.specimen_id_gh_number}`);
    } else {
      // Fallback to listing page if no exact match found
      navigate(`/plants?name=${searchTerm}`);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden min-h-screen">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-bg {
          background-image: url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80);
          background-size: cover;
          background-position: center;
        }
        .blurred-side {
          backdrop-filter: blur(40px) brightness(0.7);
          background-color: rgba(255, 255, 255, 0.3);
        }
        .text-reveal {
          background: url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80);
          background-size: cover;
          background-position: center;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: brightness(0.7) contrast(1.2);
        }
        .material-icons-outlined {
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
        }
      `}} />

      <main className="relative h-screen w-full hero-bg overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0 hero-bg scale-105 blur-[2px] brightness-[0.8]"></div>
        <div className="absolute inset-y-0 left-0 w-[42%] blurred-side z-10 border-r border-white/10"></div>

        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col px-12 py-10">
          
          {/* Search Section */}
          <div className="flex-1 flex flex-col justify-center relative">
            <div className="relative w-full max-w-2xl mx-auto mb-10 z-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a specimen (e.g., Family or Name)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  autoComplete="off"
                  className="w-full py-4 px-6 rounded-full backdrop-blur-sm bg-white/50 text-black text-lg focus:outline-none focus:ring-gray-500 focus:ring-1 shadow-xl placeholder:text-gray-700"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                  </svg>
                </button>

                {/* Dropdown Suggestions */}
                {filteredSuggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[400px] border border-white/20 z-50">
 
                    {filteredSuggestions.map((plant) => (
                      <div 
                        key={plant.specimen_id_gh_number}
                        onClick={() => navigate(`/plant-details/${plant.specimen_id_gh_number}`)}
                        className="px-6 py-4 hover:bg-green-50 cursor-pointer text-black border-b border-gray-100 last:border-0 transition-all flex justify-between items-center group"
                      >
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-green-800">{plant.name}</p>
                          <p className="text-xs text-gray-500 italic uppercase tracking-wider">{plant.family} — {plant.species}</p>
                        </div>
                        <span className="material-icons-outlined text-gray-300 group-hover:text-green-600 text-sm">north_east</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Title Section */}
            <div className="max-w-7xl mx-auto w-full">
              <h1 className="text-[7rem] font-black leading-[0.9] tracking-tighter justify-center flex items-center select-none">
                <span className="text-reveal">DIGITAL </span>
                <span className="text-white drop-shadow-2xl ml-4"> HERBARIUM</span>
              </h1>
            </div>

            {/* Right Side Indicators */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex mb-8">
            <div className="w-[42%]">
              <p className="text-white/70 max-w-sm text-md leading-relaxed mb-5">
                Explore the vast collection of botanical specimens in our Digital Herbarium. A journey through nature, preserved for science.
              </p>
              <a className="inline-flex items-center gap-4 text-sm font-bold tracking-widest hover:gap-6 transition-all group" href="#">
                EXPLORE COLLECTIONS
                <span className="material-icons-outlined text-white">east</span>
              </a>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex gap-4">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-white/30 transition-all">
                <img alt="Forest 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400" />
              </div>
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-white/30 transition-all">
                <img alt="Forest 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400" />
              </div>
              <div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/10 shadow-xl group cursor-pointer hover:border-white/30 transition-all">
                <img alt="Forest 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400" />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="w-14 h-14 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors">
                <span className="material-icons-outlined text-white">west</span>
              </button>
              <button className="w-14 h-14 rounded-3xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors">
                <span className="material-icons-outlined text-white">east</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForestSchool;