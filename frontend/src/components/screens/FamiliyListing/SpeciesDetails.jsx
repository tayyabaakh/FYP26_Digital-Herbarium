// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { botanicalFamilies } from '../../../utils/botanicalLoader';
// import { fetchPlants } from '../../../api/plantApi';
// import ImageDisplayCard from '../../commons/ImageDetailCard/ImageDetailCard';

// const SpeciesDetailScreen = () => {
//   const { familyName, speciesName } = useParams();
//   const navigate = useNavigate();

//   const [dbSpecimens, setDbSpecimens] = useState([]);
//   const [selectedSpecimen, setSelectedSpecimen] = useState(null);
//   const [loadingDb, setLoadingDb] = useState(true);

//   // 1. Find family from local parsed JSON
//   const family = botanicalFamilies.find(
//     f => f.family.toLowerCase() === decodeURIComponent(familyName).toLowerCase()
//   );

//   // 2. Locate the target genus and species
//   let targetSpecies = null;
//   let targetGenus = null;

//   if (family && family.genera) {
//     for (const gen of family.genera) {
//       const found = gen.species?.find(
//         s => s.name.toLowerCase() === decodeURIComponent(speciesName).toLowerCase()
//       );
//       if (found) {
//         targetSpecies = found;
//         targetGenus = gen;
//         break;
//       }
//     }
//   }

//   // 3. Fetch TiDB database specimens to check for live records matching this species
//   useEffect(() => {
//     let isMounted = true;
//     const loadDbSpecimens = async () => {
//       try {
//         setLoadingDb(true);
//         const response = await fetchPlants();
//         const plants = Array.isArray(response) ? response : response?.data || [];
        
//         // Match plants where species or name aligns with the current species name
//         const matches = plants.filter(p => {
//           const fullName = `${p.name || ''} ${p.species || ''}`.trim().toLowerCase();
//           return fullName.includes(decodeURIComponent(speciesName).toLowerCase());
//         });

//         if (isMounted) {
//           setDbSpecimens(matches);
//           // Default to the first specimen if available
//           if (matches.length > 0) {
//             setSelectedSpecimen(matches[0]);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load TiDB specimens for species:", err);
//       } finally {
//         if (isMounted) setLoadingDb(false);
//       }
//     };

//     loadDbSpecimens();
//     return () => { isMounted = false; };
//   }, [speciesName]);

//   if (!family || !targetSpecies) {
//     return (
//       <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-12 text-center font-display">
//         <h2 className="text-2xl font-bold mb-4">Species Record Not Found</h2>
//         <button onClick={() => navigate('/family-listing')} className="px-6 py-2.5 bg-[#244B3A] text-white text-xs font-bold rounded-xl shadow">
//           Back to Family Listing
//         </button>
//       </div>
//     );
//   }

//   const specificEpithet = targetSpecies.name.split(' ').slice(1).join(' ') || targetSpecies.name;

//   return (
//     <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-6 lg:p-14 font-display">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Breadcrumb Navigation */}
//         <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 flex flex-wrap gap-2 items-center">
//           <span onClick={() => navigate('/')} className="cursor-pointer hover:underline">Home</span> → 
//           <span onClick={() => navigate('/family-listing')} className="cursor-pointer hover:underline">Plant Families</span> → 
//           <span onClick={() => navigate(`/family-listing/${encodeURIComponent(family.family)}`)} className="cursor-pointer hover:underline">{family.family}</span> → 
//           <span className="text-emerald-800 font-bold italic">{targetSpecies.name}</span>
//         </div>

//         {/* Header Badges & Title */}
//         <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <div className="flex gap-2 mb-3">
//               <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[15px] font-bold uppercase tracking-wider rounded-lg">
//                 Family: {family.family}
//               </span>
//               <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[15px] font-bold uppercase tracking-wider rounded-lg italic">
//                 <span className='not-italic'>Genus:</span> {targetGenus?.name}
//               </span>
//               {/* {selectedSpecimen && (
//                 <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[15px] font-bold uppercase tracking-wider rounded-lg font-mono">
//                   GH NUMBER: {selectedSpecimen.specimen_id_gh_number}
//                 </span>
//               )} */}
//             </div>
//             <h1 className="text-4xl sm:text-5xl font-serif italic font-bold tracking-tight text-[#1B3022] mt-8">
//               {targetSpecies.name} <span className='not-italic text-2xl'>{targetSpecies.author}</span>
//             </h1>
//             {/* <p className="text-gray-600 font-medium text-sm sm:text-base">{targetSpecies.author}</p> */}
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-3  ">
          
//           {/* Left Column: Taxonomic Table & Specimen Records List */}
//           <div className="lg:col-span-2 space-y-5">

//             {/* Taxonomic Classification Table */}
//             <div className="">
//               {/* <div className="bg-[#244B3A] text-white p-4 font-bold text-xs uppercase tracking-wider">
//                 Taxonomic Classification
//               </div> */}
//               <table className=" text-md">
//                 <tbody className="">
//                   {/* <tr>
//                     <td className=" font-semibold text-gray-500  w-1/3">Family :</td>
//                     <td className=" font-bold text-[#1B3022]  ">{family.family}</td>
//                   </tr> */}
//                   {/* <tr>
//                     <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Genus</td>
//                     <td className="p-4 italic">{targetGenus?.name} {targetGenus?.author}</td>
//                   </tr> */}
//                   {/* <tr>
//                     <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Species Epithet</td>
//                     <td className="p-4 italic">{specificEpithet}</td>
//                   </tr> */}
//                   {/* <tr>
//                     <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Author Citation</td>
//                     <td className="p-4">{targetSpecies.author || '—'}</td>
//                   </tr> */}
//                   {/* <tr>
//                     <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Full Botanical Name</td>
//                     <td className="p-4 italic font-bold">{targetSpecies.name} {targetSpecies.author}</td>
//                   </tr> */}
//                 </tbody>
//               </table>
//             </div>

//             {/* Active Specimen Field Collection Data */}
//             {selectedSpecimen && (
//               <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm">
//                 <div className="bg-emerald-900 text-white p-4 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
//                   <span>Field Collection Data (GH NUMBER: {selectedSpecimen.specimen_id_gh_number})</span>
//                   <span className="text-[10px] bg-emerald-800 px-2.5 py-1 rounded-md font-mono">Active View</span>
//                 </div>
//                 <table className="w-full text-left text-sm">
//                   <tbody className="divide-y divide-gray-100">
//                     <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3">Collector</td>
//                       <td className="p-4  text-[#1B3022]">{selectedSpecimen.collector_name || 'N/A'}</td>
//                     </tr>
//                     <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Collection Number</td>
//                       <td className="p-4 font-mono">{selectedSpecimen.collection_no || 'N/A'}</td>
//                     </tr>
//                     <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Date of Collection</td>
//                       <td className="p-4 font-mono">{selectedSpecimen.date || 'N/A'}</td>
//                     </tr>
//                     <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Locality</td>
//                       <td className="p-4">{selectedSpecimen.locality || 'N/A'}</td>
//                     </tr>
//                      <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Habitat</td>
//                       <td className="p-4">{selectedSpecimen.habitat || 'N/A'}</td>
//                     </tr>
//                     <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Habit</td>
//                       <td className="p-4"> {selectedSpecimen.habit || 'N/A'}</td>
//                     </tr>
//                       <tr>
//                       <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Flower Color</td>
//                       <td className="p-4"> {selectedSpecimen.flower_color || 'N/A'}</td>
//                     </tr>
                    
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Live TiDB Specimen Records Selection List */}
//             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
//               <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-800">
//                 Species Records ({dbSpecimens.length})
//               </h3>
//               {loadingDb ? (
//                 <p className="text-sm text-gray-400 italic">Querying database records...</p>
//               ) : dbSpecimens.length > 0 ? (
//                 <div className="space-y-3 divide-y divide-gray-100">
//                   {dbSpecimens.map((specimen, idx) => {
//                     const isSelected = selectedSpecimen?.specimen_id_gh_number === specimen.specimen_id_gh_number;
//                     return (
//                       <div 
//                         key={specimen.specimen_id_gh_number || idx} 
//                         className={`pt-3 first:pt-0 flex justify-between items-center p-3 rounded-xl transition-all ${
//                           isSelected ? 'bg-emerald-50/80 border border-emerald-200' : 'hover:bg-gray-50'
//                         }`}
//                       >
//                         <div>
//                           <p className="text-xs font-mono text-emerald-800 font-bold uppercase">
//                             GH NO.# {specimen.specimen_id_gh_number}
//                           </p>
//                           <p className="text-sm text-gray-700 mt-1">
//                             <strong>Locality:</strong> {specimen.locality || 'N/A'}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             <strong>Habit:</strong> {specimen.habit || 'N/A'} | <strong>Flower:</strong> {specimen.flower_color || 'N/A'}
//                           </p>
//                         </div>
//                         <button 
//                           onClick={() => setSelectedSpecimen(specimen)}
//                           className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors shadow-sm ${
//                             isSelected 
//                               ? 'bg-emerald-700 text-white cursor-default' 
//                               : 'bg-[#244B3A] text-white hover:bg-emerald-900'
//                           }`}
//                         >
//                           {isSelected ? 'Viewing Active' : 'View Specimen →'}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-400 italic">No live database specimen records have been linked to this taxon yet.</p>
//               )}
//             </div>

//           </div>

//           {/* Right Column: Sidebar (Active Specimen Image & Other Species Suggestions) */}
//           <div className="space-y-6">
            
//             {/* Specimen Image Card */}
//             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
//               {selectedSpecimen && selectedSpecimen.image_url ? (
//                 <ImageDisplayCard plant={selectedSpecimen} />
                
//               ) : (
//                 <div className="w-full h-64 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center text-emerald-800 text-xs font-semibold mb-4 border border-dashed border-emerald-200 p-4">
//                   <span className="text-3xl mb-2">🌿</span>
//                   No verified botanical image available for this specimen record.
//                 </div>
//               )}
              
//               <button 
//                 onClick={() => navigate(`/family-listing/${encodeURIComponent(family.family)}`)} 
//                 className="w-full py-3 bg-[#244B3A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors shadow"
//               >
//                 ← Return to {family.family}
//               </button>
//             </div>

//             {/* Other Species in Genus Sidebar (Restored) */}
//             {targetGenus && targetGenus.species && targetGenus.species.length > 1 && (
//               <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
//                 <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 text-[11px] uppercase tracking-widest font-bold text-gray-500">
//                   Other Species in {targetGenus.name}
//                 </div>
//                 <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
//                   {targetGenus.species
//                     .filter(s => s.name !== targetSpecies.name)
//                     .map((s, idx) => (
//                       <div 
//                         key={idx}
//                         onClick={() => navigate(`/family-listing/${encodeURIComponent(family.family)}/species/${encodeURIComponent(s.name)}`)}
//                         className="px-5 py-3.5 hover:bg-emerald-50/50 cursor-pointer transition-colors"
//                       >
//                         <p className="italic text-sm font-semibold text-[#1B3022]">{s.name}</p>
//                         <p className="text-xs text-gray-400">{s.author}</p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpeciesDetailScreen;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { botanicalFamilies } from '../../../utils/botanicalLoader';
import { fetchPlants } from '../../../api/plantApi';
import ImageDisplayCard from '../../commons/ImageDetailCard/ImageDetailCard';

const SpeciesDetailScreen = () => {
  const { familyName, speciesName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedGH = new URLSearchParams(location.search).get("gh");

  const [dbSpecimens, setDbSpecimens] = useState([]);
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);

  // 1. Find family from local parsed JSON
  const family = botanicalFamilies.find(
    f => f.family.toLowerCase() === decodeURIComponent(familyName).toLowerCase()
  );

  // 2. Locate the target genus and species
  let targetSpecies = null;
  let targetGenus = null;

  if (family && family.genera) {
    for (const gen of family.genera) {
      const found = gen.species?.find(
        s => s.name.toLowerCase() === decodeURIComponent(speciesName).toLowerCase()
      );
      if (found) {
        targetSpecies = found;
        targetGenus = gen;
        break;
      }
    }
  }

  // 3. Fetch TiDB database specimens to check for live records matching this species
  useEffect(() => {
    let isMounted = true;
    const loadDbSpecimens = async () => {
      try {
        setLoadingDb(true);
        const response = await fetchPlants();
        const plants = Array.isArray(response) ? response
          : Array.isArray(response?.data) ? response.data
          : Array.isArray(response?.data?.plants) ? response.data.plants
          : Array.isArray(response?.plants) ? response.plants : [];

        const wanted = decodeURIComponent(speciesName).trim().toLowerCase();
        const wantedFamily = decodeURIComponent(familyName).trim().toLowerCase();
        const matches = plants.filter(p => {
          const botanicalName = String(p.name ?? '').trim().toLowerCase();
          const epithet = String(p.species ?? '').trim().toLowerCase();
          const fullName = `${botanicalName} ${epithet}`.trim();
          const sameFamily = !p.family || String(p.family).trim().toLowerCase() === wantedFamily;
          return sameFamily && (
            fullName === wanted || botanicalName === wanted || epithet === wanted ||
            (epithet && wanted.endsWith(` ${epithet}`))
          );
        });

        // A GH link must select the exact specimen, even if its botanical
        // name fields don't match the catalog's spelling or naming convention.
        const requested = requestedGH == null ? null : plants.find(
          p => String(p.specimen_id_gh_number ?? '').trim() === String(requestedGH).trim() &&
            (!p.family || String(p.family).trim().toLowerCase() === wantedFamily)
        );

        if (isMounted) {
          const rows = requested && !matches.includes(requested)
            ? [requested, ...matches]
            : matches;
          setDbSpecimens(rows);
          // Never silently display a different GH number when an exact GH was requested.
          setSelectedSpecimen(requestedGH != null ? (requested ?? null) : (matches[0] ?? null));
        }
      } catch (err) {
        console.error("Failed to load TiDB specimens for species:", err);
      } finally {
        if (isMounted) setLoadingDb(false);
      }
    };

    loadDbSpecimens();
    return () => { isMounted = false; };
  }, [speciesName, requestedGH]);

  if (!family || !targetSpecies) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-12 text-center font-display">
        <h2 className="text-2xl font-bold mb-4">Species Record Not Found</h2>
        <button onClick={() => navigate('/family-listing')} className="px-6 py-2.5 bg-[#244B3A] text-white text-xs font-bold rounded-xl shadow">
          Back to Family Listing
        </button>
      </div>
    );
  }

  const specificEpithet = targetSpecies.name.split(' ').slice(1).join(' ') || targetSpecies.name;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B3022] p-6 lg:p-14 font-display">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 flex flex-wrap gap-2 items-center">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:underline">Home</span> → 
          <span onClick={() => navigate('/family-listing')} className="cursor-pointer hover:underline">Plant Families</span> → 
          <span onClick={() => navigate(`/family-listing/${encodeURIComponent(family.family)}`)} className="cursor-pointer hover:underline">{family.family}</span> → 
          <span className="text-emerald-800 font-bold italic">{targetSpecies.name}</span>
        </div>

        {/* Header Badges & Title */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[15px] font-bold uppercase tracking-wider rounded-lg">
                Family: {family.family}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[15px] font-bold uppercase tracking-wider rounded-lg italic">
                <span className='not-italic'>Genus:</span> {targetGenus?.name}
              </span>
              {/* {selectedSpecimen && (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[15px] font-bold uppercase tracking-wider rounded-lg font-mono">
                  GH NUMBER: {selectedSpecimen.specimen_id_gh_number}
                </span>
              )} */}
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif italic font-bold tracking-tight text-[#1B3022] mt-8">
              {targetSpecies.name} <span className='not-italic text-2xl'>{targetSpecies.author}</span>
            </h1>
            {/* <p className="text-gray-600 font-medium text-sm sm:text-base">{targetSpecies.author}</p> */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-3  ">
          
          {/* Left Column: Taxonomic Table & Specimen Records List */}
          <div className="lg:col-span-2 space-y-5">

            {/* Taxonomic Classification Table */}
            <div className="">
              {/* <div className="bg-[#244B3A] text-white p-4 font-bold text-xs uppercase tracking-wider">
                Taxonomic Classification
              </div> */}
              <table className=" text-md">
                <tbody className="">
                  {/* <tr>
                    <td className=" font-semibold text-gray-500  w-1/3">Family :</td>
                    <td className=" font-bold text-[#1B3022]  ">{family.family}</td>
                  </tr> */}
                  {/* <tr>
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Genus</td>
                    <td className="p-4 italic">{targetGenus?.name} {targetGenus?.author}</td>
                  </tr> */}
                  {/* <tr>
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Species Epithet</td>
                    <td className="p-4 italic">{specificEpithet}</td>
                  </tr> */}
                  {/* <tr>
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Author Citation</td>
                    <td className="p-4">{targetSpecies.author || '—'}</td>
                  </tr> */}
                  {/* <tr>
                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Full Botanical Name</td>
                    <td className="p-4 italic font-bold">{targetSpecies.name} {targetSpecies.author}</td>
                  </tr> */}
                </tbody>
              </table>
            </div>

            {requestedGH && !loadingDb && !selectedSpecimen && (
              <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-sm">
                Specimen GH {requestedGH} was not found in the loaded database records.
                No other specimen has been selected in its place.
              </div>
            )}

            {/* Active Specimen Field Collection Data */}
            {selectedSpecimen && (
              <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm">
                <div className="bg-emerald-900 text-white p-4 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>Field Collection Data (GH NUMBER: {selectedSpecimen.specimen_id_gh_number})</span>
                  <span className="text-[10px] bg-emerald-800 px-2.5 py-1 rounded-md font-mono">Active View</span>
                </div>
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3">Collector</td>
                      <td className="p-4  text-[#1B3022]">{selectedSpecimen.collector_name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Collection Number</td>
                      <td className="p-4 font-mono">{selectedSpecimen.collection_no || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Date of Collection</td>
                      <td className="p-4 font-mono">{selectedSpecimen.date || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Locality</td>
                      <td className="p-4">{selectedSpecimen.locality || 'N/A'}</td>
                    </tr>
                     <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Habitat</td>
                      <td className="p-4">{selectedSpecimen.habitat || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Habit</td>
                      <td className="p-4"> {selectedSpecimen.habit || 'N/A'}</td>
                    </tr>
                      <tr>
                      <td className="p-4 font-semibold text-gray-500 bg-gray-50/50">Flower Color</td>
                      <td className="p-4"> {selectedSpecimen.flower_color || 'N/A'}</td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
            )}

            {/* Live TiDB Specimen Records Selection List */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-800">
                Species Records ({dbSpecimens.length})
              </h3>
              {loadingDb ? (
                <p className="text-sm text-gray-400 italic">Querying database records...</p>
              ) : dbSpecimens.length > 0 ? (
                <div className="space-y-3 divide-y divide-gray-100">
                  {dbSpecimens.map((specimen, idx) => {
                    const isSelected = selectedSpecimen?.specimen_id_gh_number === specimen.specimen_id_gh_number;
                    return (
                      <div 
                        key={specimen.specimen_id_gh_number || idx} 
                        className={`pt-3 first:pt-0 flex justify-between items-center p-3 rounded-xl transition-all ${
                          isSelected ? 'bg-emerald-50/80 border border-emerald-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-mono text-emerald-800 font-bold uppercase">
                            GH NO.# {specimen.specimen_id_gh_number}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Locality:</strong> {specimen.locality || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            <strong>Habit:</strong> {specimen.habit || 'N/A'} | <strong>Flower:</strong> {specimen.flower_color || 'N/A'}
                          </p>
                        </div>
                        <button 
                          onClick={() => setSelectedSpecimen(specimen)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors shadow-sm ${
                            isSelected 
                              ? 'bg-emerald-700 text-white cursor-default' 
                              : 'bg-[#244B3A] text-white hover:bg-emerald-900'
                          }`}
                        >
                          {isSelected ? 'Viewing Active' : 'View Specimen →'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No live database specimen records have been linked to this taxon yet.</p>
              )}
            </div>

          </div>

          {/* Right Column: Sidebar (Active Specimen Image & Other Species Suggestions) */}
          <div className="space-y-6">
            
            {/* Specimen Image Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
              {selectedSpecimen && selectedSpecimen.image_url ? (
                <ImageDisplayCard plant={selectedSpecimen} />
                
              ) : (
                <div className="w-full h-64 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center text-emerald-800 text-xs font-semibold mb-4 border border-dashed border-emerald-200 p-4">
                  <span className="text-3xl mb-2">🌿</span>
                  No verified botanical image available for this specimen record.
                </div>
              )}
              
              <button 
                onClick={() => navigate(`/family-listing/${encodeURIComponent(family.family)}`)} 
                className="w-full py-3 bg-[#244B3A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors shadow"
              >
                ← Return to {family.family}
              </button>
            </div>

            {/* Other Species in Genus Sidebar (Restored) */}
            {targetGenus && targetGenus.species && targetGenus.species.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                  Other Species in {targetGenus.name}
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                  {targetGenus.species
                    .filter(s => s.name !== targetSpecies.name)
                    .map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => navigate(`/family-listing/${encodeURIComponent(family.family)}/species/${encodeURIComponent(s.name)}`)}
                        className="px-5 py-3.5 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                      >
                        <p className="italic text-sm font-semibold text-[#1B3022]">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.author}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default SpeciesDetailScreen;