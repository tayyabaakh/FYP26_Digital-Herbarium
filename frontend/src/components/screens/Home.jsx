
import { botanicalFamilies, getTotalStats } from '../../utils/botanicalLoader';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/plantApi';
import herbariumImage from '../../assets/herbarium.png';

const ForestSchool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [plants, setPlants] = useState([]); // Keeps your API fetched plants for search/submit logic
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchMode, setSearchMode] = useState('startsWith');
  const navigate = useNavigate();
  const stats = getTotalStats();

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

  const normalize = (value) => String(value ?? "").trim().toLowerCase();

  // 1. Flatten your local Word-parsed botanical JSON for the search bar dropdown suggestions
  const localBotanicalItems = useMemo(() => {
    const flatItems = [];
    if (Array.isArray(botanicalFamilies)) {
      botanicalFamilies.forEach((fam) => {
        if (fam.genera && Array.isArray(fam.genera)) {
          fam.genera.forEach((gen) => {
            if (gen.species && Array.isArray(gen.species)) {
              gen.species.forEach((sp, idx) => {
                flatItems.push({
                  family: fam.family,
                  name: gen.name,
                  species: sp.name,
                  author: sp.author,
                  _uiKey: `${fam.family}-${gen.name}-${sp.name}-${idx}`
                });
              });
            }
          });
        }
      });
    }
    return flatItems;
  }, []);

  // 2. Load plants from the API on mount (retained for search submission/matching logic)
  useEffect(() => {
    let isMounted = true;

    const loadPlants = async () => {
      try {
        const response = await fetchPlants();
        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.plants)
              ? response.data.plants
              : Array.isArray(response?.plants)
                ? response.plants
                : [];

        if (isMounted) {
          setPlants(data);
        }
      } catch (error) {
        console.error("Failed to load plants:", error);
      }
    };

    loadPlants();

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Filter suggestions using ONLY your local Word JSON doc content (`localBotanicalItems`)
  useEffect(() => {
    const query = normalize(searchTerm);

    if (!query) {
      setFilteredSuggestions([]);
      return;
    }

    const getField = (plant, field) => normalize(plant?.[field]);

    const compareBy = (...fields) => (a, b) => {
      for (const field of fields) {
        const comparison = String(a[field] ?? "").localeCompare(
          String(b[field] ?? ""),
          undefined,
          { sensitivity: "base" }
        );
        if (comparison !== 0) return comparison;
      }
      return 0;
    };

    let matches = [];

    if (searchMode === "startsWith") {
      const familyMatches = localBotanicalItems
        .filter((plant) => getField(plant, "family").startsWith(query))
        .sort(compareBy("family", "name", "species"));

      const nameMatches = localBotanicalItems
        .filter((plant) => {
          const family = getField(plant, "family");
          const name = getField(plant, "name");
          return !family.startsWith(query) && name.startsWith(query);
        })
        .sort(compareBy("name", "family", "species"));

      const speciesMatches = localBotanicalItems
        .filter((plant) => {
          const family = getField(plant, "family");
          const name = getField(plant, "name");
          const species = getField(plant, "species");
          return !family.startsWith(query) && !name.startsWith(query) && species.startsWith(query);
        })
        .sort(compareBy("species", "family", "name"));

      matches = [...familyMatches, ...nameMatches, ...speciesMatches];
    } else {
      matches = localBotanicalItems
        .filter((plant) => {
          const family = getField(plant, "family");
          const name = getField(plant, "name");
          const species = getField(plant, "species");
          return family.includes(query) || name.includes(query) || species.includes(query);
        })
        .sort(compareBy("family", "name", "species"));
    }

    const seen = new Set();
    const uniqueMatches = matches.filter((plant) => {
      const key = [
        getField(plant, "family"),
        getField(plant, "name"),
        getField(plant, "species"),
      ].join("|");

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setFilteredSuggestions(uniqueMatches.slice(0, 10));
  }, [searchTerm, localBotanicalItems, searchMode]);

  // 4. Handle Search button and Enter key (Uses your API-fetched `plants` list as before)
  const handleSearch = () => {
    const query = normalize(searchTerm);
    if (!query) return;

    const matchedPlant = plants.find(
      (plant) => normalize(plant.name) === query
    );

    if (matchedPlant?.specimen_id_gh_number) {
      navigate(`/plant-details/${matchedPlant.specimen_id_gh_number}`);
    } else {
      navigate(`/family-listing/${encodeURIComponent(plant.family)}/species/${encodeURIComponent(plant.species)}`);    }

    setFilteredSuggestions([]);
  };

 // 5. Handle clicking a suggestion from the local document list
  const handleSuggestionClick = (plant) => {
    setSearchTerm(plant.species || plant.name || "");
    setFilteredSuggestions([]);
    navigate(`/family-listing/${encodeURIComponent(plant.family)}/species/${encodeURIComponent(plant.species)}`);
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
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] blurred-side z-10 border-r border-white/10" />

        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col flex-1 justify-center items-center gap-10 pt-24 sm:pt-28 md:pt-20 min-h-[calc(100vh-120px)]">
          {/* Search Container with Mode Toggle & Suggestions */}
          <div className="relative max-w-3xl w-full z-50">
            {/* Search Mode Toggles */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setSearchMode('startsWith')}
                  className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold tracking-wide transition-all ${
                    searchMode === 'startsWith' 
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/50' 
                      : 'bg-white/10 text-emerald-100 hover:bg-white/20'
                  }`}
                >
                  Starts With
                </button>
                <button 
                  type="button"
                  onClick={() => setSearchMode('includes')}
                  className={`px-3.5 py-1.5 text-xs rounded-lg font-semibold tracking-wide transition-all ${
                    searchMode === 'includes' 
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/50' 
                      : 'bg-white/10 text-emerald-100 hover:bg-white/20'
                  }`}
                >
                  Contains
                </button>
              </div>
            </div>

            {/* Main Search Input Container */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-700 transition-colors pointer-events-none">
                <span className="material-icons-outlined text-xl">search</span>
              </div>

              <input
                type="text"
                placeholder="Search plant families (e.g., Ericaceae), genera, or species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                autoComplete="off"
                className="w-full py-4 pl-14 pr-32 rounded-2xl bg-white/95 backdrop-blur-md text-[#1B3022] text-base sm:text-lg font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:bg-white shadow-2xl placeholder:text-gray-400 border border-white/20 transition-all"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button 
                  type="button"
                  onClick={handleSearch}
                  className="bg-[#244B3A] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-900 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>Search</span>
                  <span className="material-icons-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Typeahead Suggestions Dropdown (Powered by local Word JSON) */}
              {Array.isArray(filteredSuggestions) && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 top-full mt-3 w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 text-black z-[300] divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-gray-50 px-5 py-2 text-[11px] font-bold tracking-wider uppercase text-gray-400 flex justify-between">
                    <span>Matching Document Records</span>
                    <span>{filteredSuggestions.length} Results</span>
                  </div>
                  
                  <div className="max-h-[320px] overflow-y-auto">
                    {filteredSuggestions.map((plant, index) => (
                      <div
                        key={plant._uiKey || index}
                        onClick={() => handleSuggestionClick(plant)}
                        className="px-6 py-3.5 hover:bg-emerald-50/80 cursor-pointer flex justify-between items-center group transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {plant.family}
                            </span>
                            <span className="italic font-serif">{plant.name}</span>{' '}
                            <span className="italic font-light text-gray-700">{plant.species}</span>
                          </div>
                          <p className="font-bold text-gray-900 group-hover:text-emerald-900 text-sm pt-1">
                            {plant.author && <span className="text-xs font-normal text-gray-500 ml-1.5">({plant.author})</span>}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all text-gray-400">
                          <span className="material-icons-outlined text-sm">north_east</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
          
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
                className="inline-flex items-center gap-4 text-md sm:text-md font-bold tracking-widest hover:gap-6 transition-all group text-white"
                href="/family-listing"
              >
                Browse Plant Families

                <span className="material-icons-outlined text-white">east</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 w-full md:w-auto">
           
            </div>
          </div>
        </div>
      </main>

      {/* 3-Stat Bar */}
      <section className="bg-white border-b border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-center">
          <div className="p-4">
            <p className="text-4xl font-serif font-bold text-[#1B3022]">{stats.totalFamilies}</p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Plant Families</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-serif font-bold text-[#1B3022]">{stats.totalGenera}</p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Genera documented</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-serif font-bold text-[#1B3022]">{stats.totalSpecies}</p>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Species recorded</p>
          </div>
        </div>
      </section>

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
          <div className="w-full mt-7 overflow-hidden rounded-3xl shadow-xl bg-gray-200 aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[850px]">
            <img
              src={herbariumImage}
              alt="Karachi University Herbarium"
              className="w-full h-full  object-cover object-center"
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
The Herbarium is a place where a collection of dried plant specimens are kept for scientific studies. These specimens are arranged according to a particular system of classification. Nowadays a modern herbarium is a sort of research laboratory, training and reference Centre and a permanent data store house of all the plants of an area. Herbarium is a fundamental source of identification of plants and a permanent reference Centre. It serves basic need of identification for basic and applied research in botany, biology, agriculture, pharmacy, genetics pharmaceutical chemistry, aerobiology and biotechnology. Karachi University Herbarium has more than 150,000 plant species (mostly flowering plants), including those which are several decades old. A collection of taxonomic literature mainly dealing with flowering plants is also present in the herbarium. The types of new taxa (new species, sub-species, varieties) are properly preserved and kept here for future use. It also acts as a data store house and provides a major source of information on habitat, ecology, distribution of rare and endangered species. Herbarium also acts as a source of library and laboratory for the systematic research. The herbarium Staff provides significant service to the public by identifying unknown plants and by answering a number of questions about the plants, their distribution patterns, ecology and usefulness. A rich collection of specimens provides a sound foundation for training in plant biodiversity also in order to draw relationship of wild and cultivated plants, their affinities and correct identification (which is the key for the utilization of a particular species, unknown species hardly get any attention), the name of a plant is the key to its literature. One has to take information from other branches of science such as pollen morphology, chemistry, ecology, genetics etc. The data is therefore collected from these branches of science which not only helps in identification but also the better understanding of biodiversity and different environmental problems.              </p>
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