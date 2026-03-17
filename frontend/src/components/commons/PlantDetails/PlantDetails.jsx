import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the ID from URL
import { fetchPlantById } from '../../../api/api'; // Use the named export
import ImageDisplayCard from '../ImageDetailCard/ImageDetailCard';
import LocationDisplayCard from '../LocationDisplayCard/LocationDisplayCard';
import GeneralCardDetail from '../GeneralCardDetail/GeneralCardDetail';

const PlantDetail = () => {
  const { id } = useParams(); // Get specimen_id_gh_number from URL params
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const getPlantData = async () => {
    try {
      setLoading(true);
      const response = await fetchPlantById(id);
      
      // If your backend returns an array [ {...} ], take the first item
      const actualData = Array.isArray(response) ? response[0] : response;
      
      console.log("Data loaded:", actualData);
      setPlant(actualData);
    } catch (error) {
      console.error("Error loading plant details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    getPlantData();
  } else {
    // If there's no ID in the URL, stop loading so it doesn't hang
    setLoading(false); 
  }
}, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white p-20">Loading Specimen...</div>;
  if (!plant) return <div className="min-h-screen bg-black text-white p-20">Specimen not found.</div>;

  // Map your API response keys to the UI fields
  const taxonomyFields = [
    { label: "Species Name", value: plant.species, render: () => <i className="text-primary font-semibold">{plant.name} {plant.species}</i> },
    { label: "Family", value: plant.family },
    { label: "Habit", value: plant.habit },
    { label: "Flower Color", value: plant.flower_color },
  ];

  const collectionFields = [
    { label: "Primary Collector", value: plant.collector_name, render: () => <span className="font-bold">{plant.collector_name}</span> },
    { label: "Date Collected", value: plant.date },
    { label: "Group Members", value: plant.collector_group_members, fullWidth: true },
    { label: "Collection Number", value: plant.collection_no },
    { label: "Storage Folder", value: plant.specimen_folder, fullWidth: true },
  ];

  return (
    <main className="flex-1 px-10 py-20 lg:px-20 max-w-7xl mx-auto w-full font-display bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            {plant.name} <span className="text-lg font-normal text-slate-400">{plant.species}</span>
          </h1>
          <p className="text-sm text-slate-500">ID: {plant.specimen_id_gh_number}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 font-bold text-sm hover:bg-slate-700">Export PDF</button>
          <button className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-teal-700">Edit Record</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Visuals */}
        <div className="lg:col-span-5 space-y-6">
          <ImageDisplayCard imageUrl={plant.specimen_image_url || "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400"} />
          <LocationDisplayCard 
            lat="N/A" 
            lng="N/A" 
            accuracy="High"
            locality={plant.locality}
            mapUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Location_map_Germany_Berlin.png/800px-Location_map_Germany_Berlin.png"
          />
        </div>

        {/* Right: Data */}
        <div className="lg:col-span-7 space-y-6">
          <GeneralCardDetail title="Taxonomy" fields={taxonomyFields} />
          <GeneralCardDetail title="Collection Details" fields={collectionFields} />
          <GeneralCardDetail title="Habitat & Locality" fields={[
            { label: "Habitat", value: plant.habitat, fullWidth: true },
            { label: "Locality", value: plant.locality, fullWidth: true },
          ]} />
        </div>
      </div>
    </main>
  );
};

export default PlantDetail;