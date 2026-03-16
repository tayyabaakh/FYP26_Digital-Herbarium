// import React, { useState } from 'react';

// const PlantDetail = () => {
//   const [activeTab, setActiveTab] = useState('Taxonomy');
//   const [activeSubTab, setActiveSubTab] = useState('Distribution');

//   // Mock data based on your Basella alba screenshot
//   const plant = {
//     family: "Basellaceae",
//     genus: "Basella",
//     species: "Basella alba",
//     author: "L.",
//     published: "First published in Sp. Pl.: 272 (1753)",
//     status: "This species is accepted",
//     description: "The native range of this species is Tropical Asia. It is a climbing subshrub and grows primarily in the wet tropical biome...",
//     image: "https://images.unsplash.com/photo-1599023344847-d1a741c449a2?auto=format&fit=crop&q=80&w=800"
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       {/* --- TOP SECTION: Breadcrumbs & Main Info --- */}
//       <div className="flex flex-col md:flex-row border-b border-gray-200">
//         <div className="flex-1 p-8 md:p-16 bg-[#f8fcfc]">
         
          
//           <h1 className="text-4xl font-serif italic mb-2">
//             {plant.species} <span className="not-italic font-sans text-gray-400 font-light text-2xl">{plant.author}</span>
//           </h1>
          
//           <p className="text-gray-500 mb-4">{plant.published}</p>
//           <p className="text-[#008080] font-semibold mb-8 underline decoration-2 underline-offset-4">
//             {plant.status}
//           </p>
          
//           <p className="text-gray-700 leading-relaxed max-w-xl">
//             {plant.description}
//           </p>
//         </div>

//         {/* Plant Image */}
//         <div className="flex-1 h-[400px] md:h-auto overflow-hidden">
//           <img src={plant.image} alt={plant.species} className="w-full h-full object-cover" />
//         </div>
//       </div>

//       {/* --- TABS NAVIGATION --- */}
//       <div className="bg-[#008080] text-white px-8">
//         <div className="flex space-x-8 overflow-x-auto">
//           {['Taxonomy', 'Images', 'General information'].map(tab => (
//             <button 
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-4 px-2 uppercase text-sm font-bold tracking-wider border-b-4 transition-colors ${activeTab === tab ? 'border-white' : 'border-transparent hover:border-teal-200'}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* --- SUB-TABS (Only visible if Taxonomy is active) --- */}
//       {activeTab === 'Taxonomy' && (
//         <div className="border-b border-gray-200 px-8 bg-white">
//           <div className="flex space-x-10 overflow-x-auto">
//             {['Distribution', 'Synonyms', 'Classification', 'Publications', 'Other data'].map(sub => (
//               <button 
//                 key={sub}
//                 onClick={() => setActiveSubTab(sub)}
//                 className={`py-4 text-sm font-medium ${activeSubTab === sub ? 'text-black border-b-2 border-[#008080]' : 'text-gray-500 hover:text-black'}`}
//               >
//                 {sub}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* --- DYNAMIC CONTENT SECTION --- */}
//       <div className="p-8 md:p-16 max-w-7xl mx-auto">
//         {activeSubTab === 'Distribution' && (
//           <div className="flex flex-col md:flex-row gap-12">
//             <div className="w-full md:w-1/4">
//               <h2 className="text-3xl font-light mb-4">Distribution</h2>
//               <div className="flex items-center text-[#008080] font-bold">
//                 <span className="mr-2">📄</span> KBD
//               </div>
//             </div>
//             <div className="w-full md:w-3/4 bg-blue-50 rounded-lg overflow-hidden border border-gray-200 aspect-video relative">
//                {/* Placeholder for Map - Mentioning Leaflet here for next steps */}
//                <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-serif italic text-xl">
//                   Interactive Distribution Map Component Goes Here
//                </div>
//             </div>
//           </div>
//         )}

//         {activeSubTab === 'Classification' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <h2 className="text-3xl font-light mb-8">Classification</h2>
//               <div className="grid grid-cols-2 text-lg border-b border-gray-100 py-2">
//                 <span className="text-gray-400">Kingdom</span> <span>Plantae</span>
//               </div>
//               <div className="grid grid-cols-2 text-lg border-b border-gray-100 py-2">
//                 <span className="text-gray-400">Family</span> <span className="text-[#008080] italic">Basellaceae</span>
//               </div>
//               <div className="grid grid-cols-2 text-lg border-b border-gray-100 py-2">
//                 <span className="text-gray-400">Genus</span> <span className="text-[#008080] italic">Basella</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlantDetail;

// // import React, { useState } from 'react';

// // const PlantDetail = () => {
// //   const [activeTab, setActiveTab] = useState('Taxonomy');
// //   const [activeSubTab, setActiveSubTab] = useState('Distribution');

// //   // Dummy data representing the Basella alba record
// //   const plant = {
// //     family: "Basellaceae",
// //     genus: "Basella",
// //     species: "Basella alba",
// //     author: "L.",
// //     published: "First published in Sp. Pl.: 272 (1753)",
// //     status: "This species is accepted",
// //     description: "The native range of this species is Tropical Asia. It is a climbing subshrub and grows primarily in the wet tropical biome. It is used as animal food and a medicine, has environmental uses and social uses and for food.",
// //     image: "https://images.unsplash.com/photo-1599023344847-d1a741c449a2?auto=format&fit=crop&q=80&w=800",
// //     synonyms: {
// //       homotypic: [
// //         "Basella oleracea Alef. in Landw. Fl.: 281 (1866), nom. illeg. superfl.",
// //         "Basella oleracea var. alba (L.) Alef. in Landw. Fl.: 281 (1866), nom. superfl."
// //       ],
// //       heterotypic: [
// //         "Basella alba var. cordifolia (Lam.) M.R.Almeida in Fl. Maharashtra 4A: 217 (2003)",
// //         "Basella alba var. subcordata Hassk. in Cat. Hort. Bot. Bogor. Alt.: 82 (1844)",
// //         "Basella cananifolia Buch.-Ham. ex Wall. in Numer. List: n. 6961 (1832), nom. nud.",
// //         "Basella cordifolia Lam. in Encycl. 1: 382 (1785)"
// //       ]
// //     },
// //     classification: [
// //       { rank: "Kingdom", name: "Plantae" },
// //       { rank: "Phylum", name: "Streptophyta" },
// //       { rank: "Class", name: "Equisetopsida" },
// //       { rank: "Subclass", name: "Magnoliidae" },
// //       { rank: "Order", name: "Caryophyllales" },
// //       { rank: "Family", name: "Basellaceae", link: true },
// //       { rank: "Genus", name: "Basella", link: true },
// //       { rank: "Species", name: "Basella alba", link: true }
// //     ]
// //   };

// //   return (
// //     <div className="bg-white min-h-screen font-sans">
// //       {/* --- HEADER SECTION --- */}
// //       <div className="flex flex-col md:flex-row border-b border-gray-200">
// //         <div className="flex-1 p-8 md:p-12 bg-[#f8fcfc]">
// //           <nav className="text-sm text-gray-600 mb-4 italic">
// //             {plant.family} <span className="not-italic mx-1"> &gt; </span> {plant.genus}
// //           </nav>
// //           <h1 className="text-4xl font-serif italic mb-2">
// //             {plant.species} <span className="not-italic font-sans text-gray-400 font-light text-2xl">{plant.author}</span>
// //           </h1>
// //           <p className="text-gray-500 text-sm mb-4">{plant.published}</p>
// //           <p className="text-[#008080] font-bold mb-6 border-b-2 border-[#008080] inline-block pb-1">
// //             {plant.status}
// //           </p>
// //           <p className="text-gray-700 leading-relaxed text-sm md:text-base max-w-2xl">
// //             {plant.description}
// //           </p>
// //         </div>
// //         <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
// //           <img src={plant.image} alt={plant.species} className="w-full h-full object-cover" />
// //         </div>
// //       </div>

// //       {/* --- PRIMARY TABS --- */}
// //       <div className="bg-[#008080] text-white px-8 overflow-x-auto">
// //         <div className="flex space-x-8 min-w-max">
// //           {['Taxonomy', 'Images', 'General information'].map(tab => (
// //             <button 
// //               key={tab}
// //               onClick={() => setActiveTab(tab)}
// //               className={`py-4 px-2 uppercase text-xs font-bold tracking-widest border-b-4 transition-all ${activeTab === tab ? 'border-white' : 'border-transparent hover:border-teal-200'}`}
// //             >
// //               {tab}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* --- SECONDARY TABS --- */}
// //       {activeTab === 'Taxonomy' && (
// //         <div className="border-b border-gray-200 px-8 bg-white overflow-x-auto">
// //           <div className="flex space-x-10 min-w-max">
// //             {['Distribution', 'Synonyms', 'Classification', 'Publications', 'Other data'].map(sub => (
// //               <button 
// //                 key={sub}
// //                 onClick={() => setActiveSubTab(sub)}
// //                 className={`py-4 text-sm font-medium transition-colors ${activeSubTab === sub ? 'text-black border-b-2 border-[#008080]' : 'text-gray-400 hover:text-black'}`}
// //               >
// //                 {sub}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* --- CONTENT AREA --- */}
// //       <div className="p-8 md:p-12 max-w-7xl mx-auto">
        
// //         {/* Distribution Content */}
// //         {activeSubTab === 'Distribution' && (
// //           <div className="flex flex-col md:flex-row gap-8">
// //             <div className="md:w-1/4">
// //               <h2 className="text-2xl font-light mb-4 border-l-4 border-[#008080] pl-3">Distribution</h2>
// //               <div className="flex items-center text-[#008080] font-bold text-sm">
// //                 <span className="mr-2">📄</span> KBD
// //               </div>
// //             </div>
// //             <div className="flex-1 bg-slate-100 rounded border border-gray-200 aspect-video flex items-center justify-center italic text-gray-400">
// //                [ Map Component: Highlighting Tropical Asia and Madagascar ]
// //             </div>
// //           </div>
// //         )}

// //         {/* Synonyms Content */}
// //         {activeSubTab === 'Synonyms' && (
// //           <div className="flex flex-col md:flex-row gap-8">
// //             <div className="md:w-1/4">
// //               <h2 className="text-2xl font-light mb-4 border-l-4 border-[#008080] pl-3">Synonyms</h2>
// //               <p className="text-sm text-gray-500 mb-2">Has 21 Synonyms</p>
// //               <div className="flex items-center text-[#008080] font-bold text-sm">
// //                 <span className="mr-2">📄</span> KB
// //               </div>
// //             </div>
// //             <div className="flex-1 space-y-8">
// //               <div>
// //                 <h3 className="text-lg font-medium mb-4">Homotypic Synonyms</h3>
// //                 <ul className="space-y-3 text-[#008080] italic text-sm">
// //                   {plant.synonyms.homotypic.map((s, i) => <li key={i}>{s}</li>)}
// //                 </ul>
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-medium mb-4">Heterotypic Synonyms</h3>
// //                 <ul className="space-y-3 text-[#008080] italic text-sm">
// //                   {plant.synonyms.heterotypic.map((s, i) => <li key={i}>{s}</li>)}
// //                 </ul>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Classification Content */}
// //         {activeSubTab === 'Classification' && (
// //           <div className="flex flex-col md:flex-row gap-8">
// //             <div className="md:w-1/4">
// //               <h2 className="text-2xl font-light mb-4 border-l-4 border-[#008080] pl-3">Classification</h2>
// //             </div>
// //             <div className="flex-1 max-w-md">
// //               <div className="space-y-1">
// //                 {plant.classification.map((item, idx) => (
// //                   <div key={idx} className="flex py-3 border-b border-gray-50 items-center">
// //                     <span className="w-32 text-gray-400 text-sm">{item.rank}</span>
// //                     <span className={`text-sm ${item.link ? 'text-[#008080] italic font-medium cursor-pointer hover:underline' : 'text-gray-800'}`}>
// //                       {item.name}
// //                     </span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //             {/* Kew Tree Promo */}
// //             <div className="md:w-1/3 bg-[#f0f8f8] p-6 rounded-sm self-start">
// //                 <h4 className="font-bold text-gray-800 mb-2">Kew's Tree of Life Explorer</h4>
// //                 <p className="text-xs text-gray-600 mb-4">Discover the flowering plant tree of life and the genomic data used to build it.</p>
// //                 <button className="text-[#008080] text-xs font-bold underline">View the Tree of Life</button>
// //             </div>
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // };

// // export default PlantDetail;


import { useEffect, useState } from 'react';
import { fetchPlants } from '../../../api/api';

function App() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const getPlantsData = async () => {
      try {
        const { data } = await fetchPlants();
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };
    getPlantsData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Herbarium Collection</h1>
      <ul>
        {plants.map((plant, index) => (
          <li key={index}>
            <strong>{plant.name}</strong> - {plant.location_code}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;