import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { botanicalFamilies } from '../../../utils/botanicalLoader';

const FamilyDetailScreen = () => {
  const { familyName } = useParams(); // Get family name from URL
  const navigate = useNavigate();

  // Find the exact family from your JSON loader using the URL parameter
  const familyData = botanicalFamilies.find(
    f => f.family.toLowerCase() === decodeURIComponent(familyName).toLowerCase()
  );

  if (!familyData) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Family Not Found</h2>
        <button onClick={() => navigate('/family-listing')} className="px-6 py-2 bg-[#244B3A] text-white rounded-xl">
          Back to Browser
        </button>
      </div>
    );
  }

  // 1. Sort genera alphabetically
  const sortedGenera = [...(familyData.genera || [])].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  const [expandedGenera, setExpandedGenera] = useState(
    sortedGenera.reduce((acc, g) => ({ ...acc, [g.name]: true }), {})
  );
  const [localSearch, setLocalSearch] = useState('');
  const [selectedGenusFilter, setSelectedGenusFilter] = useState('All');

  const toggleGenus = (name) => {
    setExpandedGenera(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const expandAll = () => {
    const all = {};
    sortedGenera.forEach(g => all[g.name] = true);
    setExpandedGenera(all);
  };

  const collapseAll = () => {
    setExpandedGenera({});
  };

  const filteredGenera = sortedGenera.filter(gen => {
    const matchesSearch = gen.name.toLowerCase().includes(localSearch.toLowerCase()) || 
      gen.species.some(s => s.name.toLowerCase().includes(localSearch.toLowerCase()));
    const matchesFilter = selectedGenusFilter === 'All' || gen.name === selectedGenusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-6 lg:p-12 font-display">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 flex gap-2">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:underline">Home</span> → 
          <span onClick={() => navigate('/family-listing')} className="cursor-pointer hover:underline">Plant Families</span> → 
          <span className="text-emerald-800 font-bold">{familyData.family}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-1">Plant Family</p>
            <h1 className="text-5xl font-serif font-bold tracking-tight">{familyData.family}</h1>
            <p className="text-gray-600 mt-2">Explore the genera and documented species within this plant family.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 text-center">
              <span className="text-xl font-bold block">{familyData.generaCount || sortedGenera.length}</span>
              <span className="text-[10px] uppercase text-gray-400">Genera</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 text-center">
              <span className="text-xl font-bold block">{familyData.speciesCount}</span>
              <span className="text-[10px] uppercase text-gray-400">Species</span>
            </div>
          </div>
        </div>

        {/* Local Search & Genus Filter */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 justify-between items-center mb-8 shadow-sm">
          <input
            type="text"
            placeholder={`Search within ${familyData.family}...`}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="py-2 px-4 rounded-lg border border-gray-200 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <div className="flex gap-1.5 items-center flex-wrap">
            <button 
              onClick={() => setSelectedGenusFilter('All')}
              className={`px-3 py-1 rounded text-xs font-bold ${selectedGenusFilter === 'All' ? 'bg-[#1B3022] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            {sortedGenera.map(g => (
              <button
                key={g.name}
                onClick={() => setSelectedGenusFilter(g.name)}
                className={`px-3 py-1 rounded text-xs font-bold ${selectedGenusFilter === g.name ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {g.name[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Expand / Collapse Controls */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500">Genera</h3>
          <div className="space-x-4 text-xs font-bold text-emerald-800">
            <button onClick={expandAll} className="hover:underline">Expand all</button>
            <button onClick={collapseAll} className="hover:underline">Collapse all</button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredGenera.map(gen => {
            // 2. Sort species alphabetically inside each genus
            const sortedSpecies = [...(gen.species || [])].sort((a, b) =>
              a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
            );

            return (
              <div key={gen.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div 
                  onClick={() => toggleGenus(gen.name)}
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs">{expandedGenera[gen.name] ? '▾' : '▸'}</span>
                    <h4 className="font-serif italic font-bold text-lg text-[#1B3022]">{gen.name}</h4>
                    <span className="text-xs text-gray-400 not-italic">{gen.author}</span>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-medium">
                    {sortedSpecies.length} species
                  </span>
                </div>

                {expandedGenera[gen.name] && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100 bg-gray-50/50">
                    {sortedSpecies.map((sp, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => navigate(`/family-listing/${encodeURIComponent(familyData.family)}/species/${encodeURIComponent(sp.name)}`)} 
                        className="p-4 pl-12 flex justify-between items-center cursor-pointer hover:bg-emerald-50/50 transition-colors"
                      >
                        <span className="italic text-sm text-gray-800">{sp.name} <span className='not-italic'>{sp.author}</span></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FamilyDetailScreen;