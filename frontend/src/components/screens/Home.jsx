



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/plantApi';
import herbariumImage from '../../assets/herbarium.png';

const ForestSchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();

  const services = [
    {
      title: "Vascular Specimen Mounting Guidelines",
      desc: "Plant Collection. Fresh Plant Collection from Field. Cleaning and Preservation of Plants. Plant Treatment. Plants collected from field are pressed under presser in blotting paper. Pressed plants are kept in drier. Dried plants are poisoned and dried. Cold and Hot Treatment is done. Plant Mounting & Voucher Specimen Number. Dried Plant is mounted on sheet and Label is filled. Voucher specimen number is issued.",
      icon: "eco"
    },
    {
      title: "Herbarium Services",
      desc: "Herbarium Sheet Preparation and GH No. issue. Identification of Plant Sample (Complete Plant Twig with flowers and Fruit). Identification of specific plant sample. Collection of Plant samples (on demand).",
      icon: "error"
    },
    {
      title: "Medicinal Plants",
      desc: "Medicinal plants are plants that have healing properties and are used to treat or prevent diseases. Their leaves, roots, bark, or flowers contain natural compounds.",
      icon: "local_hospital"
    }
  ];

  // 1. Load data from API on component mount
  useEffect(() => {
    const loadPlants = async () => {
      try {
        const response = await fetchPlants();
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
      const matches = plants.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.family?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
      navigate(`/plants?name=${searchTerm}`);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen w-full overflow-x-hidden">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-bg {
          background-image: url(https://karuniherb.pk/wp-content/uploads/2025/11/kuh.webp);
          background-size: cover;
          background-position: center;
        }
        .blurred-side {
          backdrop-filter: blur(40px) brightness(0.7);
          background-color: rgba(255, 255, 255, 0.15);
        }
        .material-icons-outlined {
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
        }
      `}} />

      {/* Hero Section */}
      <main className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between p-6 sm:p-12 md:px-16 md:py-12 overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0 hero-bg scale-105 blur-[2px] brightness-[0.7]"></div>
        {/* Semi-transparent responsive backdrop slice for desktop panels */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] blurred-side z-10 border-r border-white/10"></div>

        {/* Content Container */}
      {/* Content Container — Changed justify-between to justify-center and added custom item gaps */}
<div className=" relative z-20 w-full max-w-7xl mx-auto flex flex-col flex-1 justify-center items-center gap-10 pt-24 sm:pt-28 md:pt-20 min-h-[calc(100vh-120px)]">
          
  {/* Search Bar Container — Added mx-auto and w-full to guarantee absolute horizontal alignment */}
  <div className="w-full max-w-2xl mx-auto z-50">
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for a specimen (e.g., Family or Name)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        autoComplete="off"
        className="w-full py-3.5 px-6 rounded-full backdrop-blur-md bg-white/70 text-black text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xl placeholder:text-gray-600 transition-all"
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
        <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[300px] border border-white/20 z-50">
          {filteredSuggestions.map((plant) => (
            <div 
              key={plant.specimen_id_gh_number}
              onClick={() => navigate(`/plant-details/${plant.specimen_id_gh_number}`)}
              className="px-6 py-3.5 hover:bg-green-50 cursor-pointer text-black border-b border-gray-100 last:border-0 transition-all flex justify-between items-center group"
            >
              <div>
                <p className="font-bold text-gray-900 group-hover:text-green-800 text-sm sm:text-base">{plant.name}</p>
                <p className="text-xs text-gray-500 italic uppercase tracking-wider">{plant.family} — {plant.species}</p>
              </div>
              <span className="material-icons-outlined text-gray-300 group-hover:text-green-600 text-sm">north_east</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Main Hero Header — Changed text-left to text-center to unify the grid focal point */}
  <div className="w-full text-center my-4">
    <div className="relative inline-block w-full max-w-4xl p-6 md:p-8 bg-black/30 backdrop-blur-sm lg:bg-black/10 rounded-2xl">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
        Welcome to <br className="hidden sm:inline"/> Karachi University
      </h1>
      <h2 className="text-[#2F8A3D]  lg:text-shadow-emerald-800 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase drop-shadow-2xl mt-2 tracking-wide">
        Herbarium
      </h2>
    </div>
  </div>

  {/* Hero Bottom Interaction Area — Kept clean at the base or flowing inline depending on screen scale */}
  <div className="w-full flex flex-col md:flex-row gap-8 justify-between items-center mt-4">
    
    {/* CTA Link */}
    <div className="w-full md:w-auto text-center md:text-left">
      <a className="inline-flex items-center gap-4 text-xs sm:text-sm font-bold tracking-widest hover:gap-6 transition-all group text-white" href="/listing">
        EXPLORE COLLECTIONS
        <span className="material-icons-outlined text-white">east</span>
      </a>
    </div>

    {/* Micro Gallery & Navigation Arrows */}
    <div className="flex flex-wrap items-center justify-center gap-6 w-full md:w-auto">
      <div className="hidden sm:flex gap-3">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
          <img alt="Forest 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=200" />
        </div>
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
          <img alt="Forest 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200" />
        </div>
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
          <img alt="Forest 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=200" />
        </div>
      </div>

  
  
    </div>

  </div>
</div>
      </main>

      {/* Services Grid Section */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
                {/* Icon Circle */}
                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-6 shrink-0">
                  <span className="material-icons-outlined text-green-600 text-3xl sm:text-4xl leading-none">
                    {service.icon}
                  </span>
                </div>
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Informational Section */}
      <section className="bg-gray-50 pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Side: Image Container */}
          <div className="w-full overflow-hidden rounded-3xl shadow-xl bg-gray-200 aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[600px]">
            <img 
              src={herbariumImage} 
              alt="Karachi University Herbarium Metal Cabinets" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="flex flex-col gap-5 sm:gap-6 lg:pt-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight uppercase">
              Karachi University Herbarium (KUH)
            </h2>

            <div className="w-20 h-1.5 bg-green-600 rounded-full"></div>

            <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
              <p className="font-medium text-gray-800">
                The Karachi University Herbarium is a state-of-the-art facility dedicated to the 
                collection, preservation, and scientific study of botanical specimens. We house an 
                extensive collection of meticulously dried and classified plants, serving as a vital 
                resource for researchers, students, and conservation efforts across Pakistan.
              </p>
              <p>
                The Herbarium is a place where a collection of dried plant specimens are kept for scientific studies. 
                These specimens are arranged according to a particular system of classification. Nowadays a modern herbarium is a sort of research laboratory, training and reference Centre and a permanent data store house of all the plants of an area. 
              </p>
              <p className="hidden sm:block">
                Karachi University Herbarium has more than 150,000 plant species (mostly flowering plants), including those which are several decades old. It also acts as a data store house and provides a major source of information on habitat, ecology, distribution of rare and endangered species. The herbarium Staff provides significant service to the public by identifying unknown plants and by answering a number of questions about the plants.
              </p>
            </div>
            
            <a href="/about" className="mt-4 self-center sm:self-start px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 text-center">
              Learn More About Us
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ForestSchool;