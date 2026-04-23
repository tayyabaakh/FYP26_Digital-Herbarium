// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // To get the ID from URL
// import { fetchPlantById } from '../../../api/api'; // Use the named export
// import ImageDisplayCard from '../ImageDetailCard/ImageDetailCard';
// import LocationDisplayCard from '../LocationDisplayCard/LocationDisplayCard';
// import GeneralCardDetail from '../GeneralCardDetail/GeneralCardDetail';

// const PlantDetail = () => {
//   const { id } = useParams(); // Get specimen_id_gh_number from URL params
//   const [plant, setPlant] = useState(null);
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const getPlantData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetchPlantById(id);
      
//       // If your backend returns an array [ {...} ], take the first item
//       const actualData = Array.isArray(response) ? response[0] : response;
      
//       console.log("Data loaded:", actualData);
//       setPlant(actualData);
//     } catch (error) {
//       console.error("Error loading plant details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (id) {
//     getPlantData();
//   } else {
//     // If there's no ID in the URL, stop loading so it doesn't hang
//     setLoading(false); 
//   }
// }, [id]);

//   if (loading) return <div className="min-h-screen bg-black text-white p-20">Loading Specimen...</div>;
//   if (!plant) return <div className="min-h-screen bg-black text-white p-20">Specimen not found.</div>;

//   // Map your API response keys to the UI fields
//   const taxonomyFields = [
//     { label: "Species Name", value: plant.species, render: () => <i className="text-primary font-semibold">{plant.name} {plant.species}</i> },
//     { label: "Family", value: plant.family },
//     { label: "Habit", value: plant.habit },
//     { label: "Flower Color", value: plant.flower_color },
//   ];

//   const collectionFields = [
//     { label: "Primary Collector", value: plant.collector_name, render: () => <span className="font-bold">{plant.collector_name}</span> },
//     { label: "Date Collected", value: plant.date },
//     { label: "Group Members", value: plant.collector_group_members, fullWidth: true },
//     { label: "Collection Number", value: plant.collection_no },
//     { label: "Storage Folder", value: plant.specimen_folder, fullWidth: true },
//   ];

//   return (
//     <main className="flex-1 px-10 py-20 lg:px-20  mx-auto w-full font-display bg-black min-h-screen text-white">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-extrabold flex items-center gap-3">
//             {plant.name} <span className="text-lg font-normal text-slate-400">{plant.species}</span>
//           </h1>
//           <p className="text-sm text-slate-500">ID: {plant.specimen_id_gh_number}</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 font-bold text-sm hover:bg-slate-700">Export PDF</button>
//           <button className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-teal-700">Edit Record</button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         {/* Left: Visuals */}
//         <div className="lg:col-span-5 space-y-6">
//           <ImageDisplayCard imageUrl={plant.specimen_image_url || "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400"} />
//           <LocationDisplayCard 
//             lat="N/A" 
//             lng="N/A" 
//             accuracy="High"
//             locality={plant.locality}
//             mapUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Location_map_Germany_Berlin.png/800px-Location_map_Germany_Berlin.png"
//           />
//         </div>

//         {/* Right: Data */}
//         <div className="lg:col-span-7 space-y-6">
//           <GeneralCardDetail title="Taxonomy" fields={taxonomyFields} />
//           <GeneralCardDetail title="Collection Details" fields={collectionFields} />
//           <GeneralCardDetail title="Habitat & Locality" fields={[
//             { label: "Habitat", value: plant.habitat, fullWidth: true },
//             { label: "Locality", value: plant.locality, fullWidth: true },
//           ]} />
//         </div>
//       </div>
//     </main>
//   );
// };

// export default PlantDetail;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPlantById } from '../../../api/api';
import ImageDisplayCard from '../ImageDetailCard/ImageDetailCard';
import LocationDisplayCard from '../LocationDisplayCard/LocationDisplayCard';
import GeneralCardDetail from '../GeneralCardDetail/GeneralCardDetail';

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlantData = async () => {
      try {
        setLoading(true);
        const response = await fetchPlantById(id);
        const actualData = Array.isArray(response) ? response[0] : response;
        setPlant(actualData);
      } catch (error) {
        console.error("Error loading plant details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getPlantData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="animate-pulse text-emerald-500 font-mono tracking-widest">INITIALIZING SPECIMEN_DATA...</div>
    </div>
  );

  if (!plant) return <div className="min-h-screen bg-[#0B0F1A] text-white p-20">Record not found.</div>;

  const taxonomyFields = [
    { label: "Scientific Name", value: `${plant.name} ${plant.species}`, render: () => <span className="italic text-emerald-400 font-semibold">{plant.name} {plant.species}</span> },
    { label: "Family", value: plant.family },
    { label: "Growth Habit", value: plant.habit },
    { label: "Floral Characteristics", value: plant.flower_color },
  ];

  const collectionFields = [
    { label: "Lead Collector", value: plant.collector_name },
    { label: "Date of Accession", value: plant.date },
    { label: "Collection Number", value: `#${plant.collection_no}` },
    { label: "Storage Location", value: plant.specimen_folder },
  ];

  return (
    <main className="min-h-screen bg-[#016630] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-emerald-500 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">
                {plant.name} <span className="text-slate-500 font-light not-italic ml-2">{plant.species}</span>
              </h1>
              <p className="text-[10px] font-mono text-emerald-500/70 uppercase tracking-tighter">Archive Ref: {plant.specimen_id_gh_number}</p>
            </div>
          </div>
          {/* <div className="flex gap-3">
            <button className="px-4 py-2 rounded text-xs font-bold border border-slate-700 hover:bg-slate-800 transition-all uppercase tracking-widest">Export PDF</button>
            <button className="px-4 py-2 rounded text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all uppercase tracking-widest shadow-lg shadow-emerald-900/20">Edit Entry</button>
          </div> */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Specimen Visualization */}
          <div className="lg:col-span-5 space-y-8">
            <ImageDisplayCard imageUrl={plant.specimen_image_url} />
            <LocationDisplayCard 
              lat="52.5200" 
              lng="13.4050" 
              locality={plant.locality}
              mapUrl="https://api.maptiler.com/maps/darkmatter/static/13.405,52.52,12/400x300.png?key=YOUR_KEY" // Example of a dark map
            />
          </div>

          {/* Right: Technical Metadata */}
          <div className="lg:col-span-7 space-y-6">
            <section className="animate-in fade-in slide-in-from-right duration-700">
              <GeneralCardDetail title="Biological Taxonomy" icon="biotech" fields={taxonomyFields} />
              <div className="mt-6">
                <GeneralCardDetail title="Field Collection Data" icon="inventory_2" fields={collectionFields} />
              </div>
              <div className="mt-6">
                <GeneralCardDetail 
                  title="Environmental Context" 
                  icon="Landscape"
                  fields={[
                    { label: "Habitat Description", value: plant.habitat, fullWidth: true },
                    { label: "Specific Locality", value: plant.locality, fullWidth: true },
                  ]} 
                />
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
};

export default PlantDetail;