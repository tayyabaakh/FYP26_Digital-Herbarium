



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchPlants } from '../../api/plantApi';
// import herbariumImage from '../../assets/herbarium.png';

// const ForestSchool = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [plants, setPlants] = useState([]);
//   const [filteredSuggestions, setFilteredSuggestions] = useState([]);
//   const navigate = useNavigate();

//   const services = [
//     {
//       title: "Vascular Specimen Mounting Guidelines",
//       desc: "Plant Collection. Fresh Plant Collection from Field. Cleaning and Preservation of Plants. Plant Treatment. Plants collected from field are pressed under presser in blotting paper. Pressed plants are kept in drier. Dried plants are poisoned and dried. Cold and Hot Treatment is done. Plant Mounting & Voucher Specimen Number. Dried Plant is mounted on sheet and Label is filled. Voucher specimen number is issued.",
//       icon: "eco"
//     },
//     {
//       title: "Herbarium Services",
//       desc: "Herbarium Sheet Preparation and GH No. issue. Identification of Plant Sample (Complete Plant Twig with flowers and Fruit). Identification of specific plant sample. Collection of Plant samples (on demand).",
//       icon: "error"
//     },
//     {
//       title: "Medicinal Plants",
//       desc: "Medicinal plants are plants that have healing properties and are used to treat or prevent diseases. Their leaves, roots, bark, or flowers contain natural compounds.",
//       icon: "local_hospital"
//     }
//   ];

//   // 1. Load data from API on component mount
//   useEffect(() => {
//     const loadPlants = async () => {
//       try {
//         const response = await fetchPlants();
//         const data = response.data || response;
//         setPlants(data);
//       } catch (err) {
//         console.error("Failed to load plants for search", err);
//       }
//     };
//     loadPlants();
//   }, []);

//   // 2. Filter logic for the dropdown suggestions
//   useEffect(() => {
//     if (searchTerm.trim().length > 0) {
//       const matches = plants.filter(p => 
//         p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.family?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredSuggestions(matches);
//     } else {
//       setFilteredSuggestions([]);
//     }
//   }, [searchTerm, plants]);

//   // 3. Navigation handler for Search Button or Enter Key
//   const handleSearch = () => {
//     if (!searchTerm.trim()) return;

//     const matchedPlant = plants.find(
//       (p) => p.name?.toLowerCase() === searchTerm.toLowerCase().trim()
//     );

//     if (matchedPlant) {
//       navigate(`/plant-details/${matchedPlant.specimen_id_gh_number}`);
//     } else {
//       navigate(`/plants?name=${searchTerm}`);
//     }
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen w-full overflow-x-hidden">
//       <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

//       <style dangerouslySetInnerHTML={{
//         __html: `
//         .hero-bg {
//           background-image: url(https://karuniherb.pk/wp-content/uploads/2025/11/kuh.webp);
//           background-size: cover;
//           background-position: center;
//         }
//         .blurred-side {
//           backdrop-filter: blur(40px) brightness(0.7);
//           background-color: rgba(255, 255, 255, 0.15);
//         }
//         .material-icons-outlined {
//           display: inline-block;
//           vertical-align: middle;
//           line-height: 1;
//         }
//       `}} />

//       {/* Hero Section */}
//       <main className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between p-6 sm:p-12 md:px-16 md:py-12 overflow-hidden">
//         {/* Background Layers */}
//         <div className="absolute inset-0 z-0 hero-bg scale-105 blur-[2px] brightness-[0.7]"></div>
//         {/* Semi-transparent responsive backdrop slice for desktop panels */}
//         <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] blurred-side z-10 border-r border-white/10"></div>

//         {/* Content Container */}
//       {/* Content Container — Changed justify-between to justify-center and added custom item gaps */}
// <div className=" relative z-20 w-full max-w-7xl mx-auto flex flex-col flex-1 justify-center items-center gap-10 pt-24 sm:pt-28 md:pt-20 min-h-[calc(100vh-120px)]">
          
//   {/* Search Bar Container — Added mx-auto and w-full to guarantee absolute horizontal alignment */}
//   <div className="w-full max-w-2xl mx-auto z-50">
//     <div className="relative w-full">
//       <input
//         type="text"
//         placeholder="Search..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//         autoComplete="off"
//         className="w-full py-3.5 px-6 rounded-full backdrop-blur-md bg-white/70 text-black text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xl placeholder:text-gray-600 transition-all"
//       />
//       <button 
//         onClick={handleSearch}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
//         </svg>
//       </button>

//       {/* Dropdown Suggestions */}
//       {filteredSuggestions.length > 0 && (
//         <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[300px] border border-white/20 z-50">
//           {filteredSuggestions.map((plant) => (
//             <div 
//               key={plant.specimen_id_gh_number}
//               onClick={() => navigate(`/plant-details/${plant.specimen_id_gh_number}`)}
//               className="px-6 py-3.5 hover:bg-green-50 cursor-pointer text-black border-b border-gray-100 last:border-0 transition-all flex justify-between items-center group"
//             >
//               <div>
//                 <p className="font-bold text-gray-900 group-hover:text-green-800 text-sm sm:text-base">{plant.name}</p>
//                 <p className="text-xs text-gray-500 italic uppercase tracking-wider">{plant.family} — {plant.species}</p>
//               </div>
//               <span className="material-icons-outlined text-gray-300 group-hover:text-green-600 text-sm">north_east</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   </div>

//   {/* Main Hero Header — Changed text-left to text-center to unify the grid focal point */}
//   <div className="w-full text-center my-4">
//     <div className="relative inline-block w-full max-w-4xl p-6 md:p-8 bg-black/30 backdrop-blur-sm lg:bg-black/10 rounded-2xl">
//       <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
//         Welcome to <br className="hidden sm:inline"/> Karachi University
//       </h1>
//       <h2 className="text-[#2F8A3D]  lg:text-shadow-emerald-800 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase drop-shadow-2xl mt-2 tracking-wide">
//         Herbarium
//       </h2>
//     </div>
//   </div>

//   {/* Hero Bottom Interaction Area — Kept clean at the base or flowing inline depending on screen scale */}
//   <div className="w-full flex flex-col md:flex-row gap-8 justify-between items-center mt-4">
    
//     {/* CTA Link */}
//     <div className="w-full md:w-auto text-center md:text-left">
//       <a className="inline-flex items-center gap-4 text-xs sm:text-sm font-bold tracking-widest hover:gap-6 transition-all group text-white" href="/listing">
//         EXPLORE COLLECTIONS
//         <span className="material-icons-outlined text-white">east</span>
//       </a>
//     </div>

//     {/* Micro Gallery & Navigation Arrows */}
//     <div className="flex flex-wrap items-center justify-center gap-6 w-full md:w-auto">
//       <div className="hidden sm:flex gap-3">
//         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
//           <img alt="Forest 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=200" />
//         </div>
//         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
//           <img alt="Forest 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200" />
//         </div>
//         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
//           <img alt="Forest 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=200" />
//         </div>
//       </div>

  
  
//     </div>

//   </div>
// </div>
//       </main>

//       {/* Services Grid Section */}
//       <section className="bg-gray-50 py-12 sm:py-20 px-4 sm:px-8 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//             {services.map((service, index) => (
//               <div key={index} className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
//                 {/* Icon Circle */}
//                 <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-6 shrink-0">
//                   <span className="material-icons-outlined text-green-600 text-3xl sm:text-4xl leading-none">
//                     {service.icon}
//                   </span>
//                 </div>
//                 {/* Title */}
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
//                 {/* Description */}
//                 <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
//                   {service.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Detailed Informational Section */}
//       <section className="bg-gray-50 pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 lg:px-24">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
//           {/* Left Side: Image Container */}
//           <div className="w-full overflow-hidden rounded-3xl shadow-xl bg-gray-200 aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[600px]">
//             <img 
//               src={herbariumImage} 
//               alt="Karachi University Herbarium Metal Cabinets" 
//               className="w-full h-full object-cover object-center"
//             />
//           </div>

//           {/* Right Side: Text Content */}
//           <div className="flex flex-col gap-5 sm:gap-6 lg:pt-4">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight uppercase">
//               Karachi University Herbarium (KUH)
//             </h2>

//             <div className="w-20 h-1.5 bg-green-600 rounded-full"></div>

//             <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
//               <p className="font-medium text-gray-800">
//                 The Karachi University Herbarium is a state-of-the-art facility dedicated to the 
//                 collection, preservation, and scientific study of botanical specimens. We house an 
//                 extensive collection of meticulously dried and classified plants, serving as a vital 
//                 resource for researchers, students, and conservation efforts across Pakistan.
//               </p>
//               <p>
//                 The Herbarium is a place where a collection of dried plant specimens are kept for scientific studies. 
//                 These specimens are arranged according to a particular system of classification. Nowadays a modern herbarium is a sort of research laboratory, training and reference Centre and a permanent data store house of all the plants of an area. 
//               </p>
//               <p className="hidden sm:block">
//                 Karachi University Herbarium has more than 150,000 plant species (mostly flowering plants), including those which are several decades old. It also acts as a data store house and provides a major source of information on habitat, ecology, distribution of rare and endangered species. The herbarium Staff provides significant service to the public by identifying unknown plants and by answering a number of questions about the plants.
//               </p>
//             </div>
            
//             <a href="/about" className="mt-4 self-center sm:self-start px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 text-center">
//               Learn More About Us
//             </a>
//           </div>

//         </div>
//       </section>
//     </div>
//   );
// };

// export default ForestSchool;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/plantApi';
import herbariumImage from '../../assets/herbarium.png';

const ForestSchool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchMode, setSearchMode] = useState('startsWith'); // default mode
  const navigate = useNavigate();

  const services = [
    {
      title: 'Vascular Specimen Mounting Guidelines',
      desc: 'Plant Collection. Fresh Plant Collection from Field. Cleaning and Preservation of Plants. Plant Treatment. Plants collected from field are pressed under presser in blotting paper. Pressed plants are kept in drier. Dried plants are poisoned and dried. Cold and Hot Treatment is done. Plant Mounting & Voucher Specimen Number. Dried Plant is mounted on sheet and Label is filled. Voucher specimen number is issued.',
      icon: 'eco'
    },
    {
      title: 'Herbarium Services',
      desc: 'Herbarium Sheet Preparation and GH No. issue. Identification of Plant Sample (Complete Plant Twig with flowers and Fruit). Identification of specific plant sample. Collection of Plant samples (on demand).',
      icon: 'error'
    },
    {
      title: 'Medicinal Plants',
      desc: 'Medicinal plants are plants that have healing properties and are used to treat or prevent diseases. Their leaves, roots, bark, or flowers contain natural compounds.',
      icon: 'local_hospital'
    }
  ];

  const normalize = (value) => String(value ?? '').trim().toLowerCase();

  useEffect(() => {
  const cleanSearch = normalize(searchTerm);

  if (!cleanSearch) {
    setFilteredSuggestions([]);
    return;
  }

  // Helper comparator for Family -> Name -> Species alphabetical order
  const alphabeticalCompare = (a, b) => {
    const familyComp = String(a.family || '').localeCompare(String(b.family || ''), undefined, { sensitivity: 'base' });
    if (familyComp !== 0) return familyComp;

    const nameComp = String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
    if (nameComp !== 0) return nameComp;

    return String(a.species || '').localeCompare(String(b.species || ''), undefined, { sensitivity: 'base' });
  };

  let sortedMatches = [];

  if (searchMode === 'startsWith') {
    // Priority 1: Families starting with search term
    const familyMatches = plants
      .filter((p) => normalize(p.family).startsWith(cleanSearch))
      .sort(alphabeticalCompare);

    // Priority 2: Names starting with search term (excluding already matched families)
    const nameMatches = plants
      .filter(
        (p) =>
          !normalize(p.family).startsWith(cleanSearch) &&
          normalize(p.name).startsWith(cleanSearch)
      )
      .sort(alphabeticalCompare);

    // Priority 3: Species starting with search term (excluding priority 1 & 2)
    const speciesMatches = plants
      .filter(
        (p) =>
          !normalize(p.family).startsWith(cleanSearch) &&
          !normalize(p.name).startsWith(cleanSearch) &&
          normalize(p.species).startsWith(cleanSearch)
      )
      .sort(alphabeticalCompare);

    sortedMatches = [...familyMatches, ...nameMatches, ...speciesMatches];
  } else {
    // Mode: 'includes' — filter all and sort alphabetically
    sortedMatches = plants
      .filter((p) => {
        const plantFamily = normalize(p.family);
        const plantName = normalize(p.name);
        const plantSpecies = normalize(p.species);
        return (
          plantFamily.includes(cleanSearch) ||
          plantName.includes(cleanSearch) ||
          plantSpecies.includes(cleanSearch)
        );
      })
      .sort(alphabeticalCompare);
  }

  // Deduplicate visible suggestions while maintaining priority and alphabetical order
  const seen = new Set();
  const deduped = sortedMatches.filter((plant) => {
    const visibleKey = `${normalize(plant.family)}|${normalize(plant.name)}|${normalize(plant.species)}`;
    if (seen.has(visibleKey)) return false;
    seen.add(visibleKey);
    return true;
  });

  setFilteredSuggestions(deduped.slice(0, 10));
}, [searchTerm, plants, searchMode]);

useEffect(() => {
  const cleanSearch = normalize(searchTerm);

  if (!cleanSearch) {
    setFilteredSuggestions([]);
    return;
  }

  // Safe field normalizer (handles null, undefined, empty strings)
  const getField = (obj, field) => normalize(obj?.[field]);

  // Alphabetical comparator builder
  const compareBy = (...fields) => (a, b) => {
    for (const field of fields) {
      const valA = String(a[field] || '');
      const valB = String(b[field] || '');
      const comp = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
      if (comp !== 0) return comp;
    }
    return 0;
  };

  let sortedMatches = [];

  if (searchMode === 'startsWith') {
    // 1. Tier 1: Family STARTS WITH query (Highest Priority)
    const familyTier = plants
      .filter((p) => {
        const family = getField(p, 'family');
        return family && family.startsWith(cleanSearch);
      })
      .sort(compareBy('family', 'name', 'species'));

    // 2. Tier 2: Genus/Name STARTS WITH query (Exclude Tier 1)
    const nameTier = plants
      .filter((p) => {
        const family = getField(p, 'family');
        const name = getField(p, 'name');
        const familyMatched = family && family.startsWith(cleanSearch);
        const nameMatched = name && name.startsWith(cleanSearch);
        return !familyMatched && nameMatched;
      })
      .sort(compareBy('name', 'family', 'species'));

    // 3. Tier 3: Species STARTS WITH query (Exclude Tier 1 & 2)
    const speciesTier = plants
      .filter((p) => {
        const family = getField(p, 'family');
        const name = getField(p, 'name');
        const species = getField(p, 'species');
        const familyMatched = family && family.startsWith(cleanSearch);
        const nameMatched = name && name.startsWith(cleanSearch);
        const speciesMatched = species && species.startsWith(cleanSearch);
        return !familyMatched && !nameMatched && speciesMatched;
      })
      .sort(compareBy('species', 'family', 'name'));

    sortedMatches = [...familyTier, ...nameTier, ...speciesTier];
  } else {
    // Mode: 'contains' / 'includes'
    const containsMatches = plants.filter((p) => {
      const family = getField(p, 'family');
      const name = getField(p, 'name');
      const species = getField(p, 'species');
      return (
        family.includes(cleanSearch) ||
        name.includes(cleanSearch) ||
        species.includes(cleanSearch)
      );
    });

    sortedMatches = containsMatches.sort(compareBy('family', 'name', 'species'));
  }

  // Deduplicate visible suggestions while preserving top priorities
  const seen = new Set();
  const deduped = sortedMatches.filter((plant) => {
    const visibleKey = `${getField(plant, 'family')}|${getField(plant, 'name')}|${getField(plant, 'species')}`;
    if (seen.has(visibleKey)) return false;
    seen.add(visibleKey);
    return true;
  });

  setFilteredSuggestions(deduped.slice(0, 10));
}, [searchTerm, plants, searchMode]);

  const handleSearch = () => {
    const cleanSearch = normalize(searchTerm);
    if (!cleanSearch) return;

    // exact match by name first
    const matchedPlant = plants.find(
      (p) => normalize(p.name) === cleanSearch
    );

    if (matchedPlant) {
      navigate(`/plant-details/${matchedPlant.specimen_id_gh_number}`);
    } else {
      navigate(`/plants?name=${encodeURIComponent(searchTerm.trim())}&mode=${searchMode}`);
    }
  };

  const handleSuggestionClick = (plant) => {
    setSearchTerm(plant.name || '');
    setFilteredSuggestions([]);
    navigate(`/plant-details/${plant.specimen_id_gh_number}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen w-full overflow-x-hidden">
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-bg {
              background-image: url('https://karuniherb.pk/wp-content/uploads/2025/11/kuh.webp');
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
          `
        }}
      />

      {/* Hero Section */}
      <main className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between p-6 sm:p-12 md:px-16 md:py-12">
        <div className="absolute inset-0 z-0 hero-bg scale-105 blur-[2px] brightness-[0.7]" />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%]  blurred-side z-10  border-r border-white/10" />

        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col flex-1 justify-center items-center gap-10 pt-24 sm:pt-28 md:pt-20 min-h-[calc(100vh-120px)]">
          {/* SEARCH BLOCK */}
          <div className="relative w-full max-w-2xl mx-auto z-[200]">
            {/* Toggle */}
            <div className="flex justify-center mb-3">
              <div className="inline-flex bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
                <button
                  type="button"
                  onClick={() => setSearchMode('startsWith')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    searchMode === 'startsWith'
                      ? 'bg-green-600 text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Starts With
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMode('includes')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    searchMode === 'includes'
                      ? 'bg-green-600 text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Contains
                </button>
              </div>
            </div>

            {/* Search input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={
                  searchMode === 'startsWith'
                    ? 'Search  from the beginning...'
                    : 'Search anywhere...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                autoComplete="off"
                className="w-full py-3.5 px-6 pr-14 rounded-full backdrop-blur-md bg-white/70 text-black text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-600 shadow-xl placeholder:text-gray-600 transition-all"
              />

              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>

              {/* Suggestions dropdown */}
              {filteredSuggestions.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[300px] border border-white/20 z-[300]">
                  {filteredSuggestions.map((plant) => (
                    <div
                      key={plant._uiKey}
                      onClick={() => handleSuggestionClick(plant)}
                      className="px-6 py-3.5 hover:bg-green-50 cursor-pointer text-black border-b border-gray-100 last:border-0 transition-all flex justify-between items-center group"
                    >
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-green-800 text-sm sm:text-base">
                          {plant.family || ''} <span className='italic font-light'>{plant.name || ''} {plant.species || ''}</span>
                        </p>
                        {/* <p className="text-xs text-gray-500 italic  tracking-wider">
                          {plant.name || ''} {plant.species || ''}
                        </p> */}
                      </div>
                      <span className="material-icons-outlined text-gray-300 group-hover:text-green-600 text-sm">
                        north_east
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="w-full text-center my-4">
            <div className="relative inline-block w-full max-w-4xl p-6 md:p-8 bg-black/30 backdrop-blur-sm lg:bg-black/10 rounded-2xl">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
                Welcome to <br className="hidden sm:inline" /> Karachi University
              </h1>
              <h2 className="text-[#2F8A3D] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase drop-shadow-2xl mt-2 tracking-wide">
                Herbarium
              </h2>
            </div>
          </div>

          {/* BOTTOM STRIP */}
          <div className="w-full flex flex-col md:flex-row gap-8 justify-between items-center mt-4">
            <div className="w-full md:w-auto text-center md:text-left">
              <a
                className="inline-flex items-center gap-4 text-xs sm:text-sm font-bold tracking-widest hover:gap-6 transition-all group text-white"
                href="/listing"
              >
                EXPLORE COLLECTIONS
                <span className="material-icons-outlined text-white">east</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 w-full md:w-auto">
              <div className="hidden sm:flex gap-3">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
                  <img
                    alt="Forest 1"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=200"
                  />
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
                  <img
                    alt="Forest 2"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200"
                  />
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-white/20 group cursor-pointer hover:border-white/50 transition-all">
                  <img
                    alt="Forest 3"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SERVICES */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-6 shrink-0">
                  <span className="material-icons-outlined text-green-600 text-3xl sm:text-4xl leading-none">
                    {service.icon}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-gray-50 pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="w-full overflow-hidden rounded-3xl shadow-xl bg-gray-200 aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[600px]">
            <img
              src={herbariumImage}
              alt="Karachi University Herbarium"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex flex-col gap-5 sm:gap-6 lg:pt-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight uppercase">
              Karachi University Herbarium (KUH)
            </h2>
            <div className="w-20 h-1.5 bg-green-600 rounded-full" />
            <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
              <p className="font-medium text-gray-800">
                The Karachi University Herbarium is a state-of-the-art facility dedicated to botanical specimens.
              </p>
              <p>
                The Herbarium is a place where a collection of dried plant specimens are kept for scientific studies.
              </p>
            </div>
            <a
              href="/about"
              className="mt-4 self-center sm:self-start px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 text-center"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForestSchool;