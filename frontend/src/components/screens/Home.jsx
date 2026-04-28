import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/api';
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
    icon: "local_hospital" // Using local_hospital as a substitute for medicinal icon
  }
];

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
    <>
    <div className="bg-background-light dark:bg-background-dark font-display  text-white overflow-hidden min-h-screen">
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
          background-color: rgba(255, 255, 255, 0.3);
        }
        .text-reveal {
          background: url(https://karuniherb.pk/wp-content/uploads/2025/11/kuh.webp);
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

      <main className=" relative h-full py-10 w-full overflow-hidden ">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0 hero-bg scale-105 blur-[2px] brightness-[0.8]"></div>
        <div className="absolute inset-y-0 left-0 w-[42%] blurred-side z-10 border-r border-white/10"></div>

        {/* Content Container */}
        <div className="relative z-20 mt-10 h-full flex flex-col px-12 py-10">
          
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
            <div className="max-w-6xl mx-auto w-full">
              <h1 className="text-[7rem] font-black leading-[0.9] tracking-tighter justify-center flex items-center select-none">
             <div className="relative flex flex-col justify-center items-center h-60 w-full bg-cover bg-center" >
  
  {/* This is the Dark Overlay: it makes white text readable */}
  <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>

  {/* Text Content: z-10 ensures text sits on top of the overlay */}
  <div className="relative z-10 text-center ">
    <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-tight">
      Welcome to Karachi University
    </h1>
    <h2 className="text-white text-5xl md:text-6xl font-black uppercase drop-shadow-2xl mt-2">
      Herbarium
    </h2>
  </div>
</div>
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
          <div className="flex mt-5 mb-5">
            <div className="w-[42%]">
            
              <a className="inline-flex items-center gap-4 text-sm font-bold tracking-widest hover:gap-6 transition-all group" href="/listing">
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
       <section className="bg-gray-50 py-20 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <div key={index} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
          
          {/* Icon Circle */}
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
  <span className="material-icons-outlined text-green-600 text-4xl leading-none">
    {service.icon}
  </span>
</div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
          
          {/* Description */}
          <p className="text-gray-800 leading-relaxed text-md">
            {service.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Image Container */}
        <div className=" overflow-hidden shadow-2xl h-full">
        <img 
      src={herbariumImage} // Use the variable here
      alt="Karachi University Herbarium Metal Cabinets" 
      className="w-full h-full object-cover object-center aspect-square md:aspect-auto"
    />
        </div>

        {/* Right Side: Text Content */}
        <div className="flex flex-col gap-6 md:pl-10">
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight uppercase">
            Karachi University Herbarium (KUH)
          </h2>

          {/* Separator Line (Optional, looks clean) */}
          <div className="w-24 h-1 bg-green-600 rounded-full"></div>

          {/* Main Description */}
          <div className="flex flex-col gap-5 text-gray-700 leading-relaxed text-base font-normal">
            <p>
              The Karachi University Herbarium is a state-of-the-art facility dedicated to the 
              collection, preservation, and scientific study of botanical specimens. We house an 
              extensive collection of meticulously dried and classified plants, serving as a vital 
              resource for researchers, students, and conservation efforts across Pakistan.
            </p>
            
            <p>
             The Herbarium is a place where a collection of dried plant specimens are kept for scientific studies. These specimens are arranged according to a particular system of classification. Nowadays a modern herbarium is a sort of research laboratory, training and reference Centre and a permanent data store house of all the plants of an area. Herbarium is a fundamental source of identification of plants and a permanent reference Centre. It serves basic need of identification for basic and applied research in botany, biology, agriculture, pharmacy, genetics pharmaceutical chemistry, aerobiology and biotechnology. Karachi University Herbarium has more than 150,000 plant species (mostly flowering plants), including those which are several decades old. A collection of taxonomic literature mainly dealing with flowering plants is also present in the herbarium. The types of new taxa (new species, sub-species, varieties) are properly preserved and kept here for future use. It also acts as a data store house and provides a major source of information on habitat, ecology, distribution of rare and endangered species. Herbarium also acts as a source of library and laboratory for the systematic research. The herbarium Staff provides significant service to the public by identifying unknown plants and by answering a number of questions about the plants, their distribution patterns, ecology and usefulness. A rich collection of specimens provides a sound foundation for training in plant biodiversity also in order to draw relationship of wild and cultivated plants, their affinities and correct identification (which is the key for the utilization of a particular species, unknown species hardly get any attention), the name of a plant is the key to its literature. One has to take information from other branches of science such as pollen morphology, chemistry, ecology, genetics etc. The data is therefore collected from these branches of science which not only helps in identification but also the better understanding of biodiversity and different environmental problems.
            </p>
          </div>
          
          {/* Call to Action Button */}
          <a href="/about" className="mt-6 self-start px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300">
            Learn More About Us
          </a>
          
        </div>
      </div>
    </section>
    </div>
   
</>
  );
};

export default ForestSchool;