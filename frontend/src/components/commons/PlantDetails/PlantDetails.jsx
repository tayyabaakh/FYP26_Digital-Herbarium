import React from 'react';
import ImageDisplayCard from '../ImageDetailCard/ImageDetailCard';
import LocationDisplayCard from '../LocationDisplayCard/LocationDisplayCard';
import GeneralCardDetail from '../GeneralCardDetail/GeneralCardDetail';


const PlantDetail = ({ plantData = {
  species: "Quercus robur",
  author: "L. Johnwick",
  commonName: "Common Oak",
  family: "Fagaceae",
  habit: "Large deciduous tree",
  collector: "Dr. Aris Thorne",
  date: "May 14, 2026",
  members: "L. Miller, J. Sterling, S. Chen",
  collectionId: "AT-2026-B04",
  storage: "Drawer 12, Cabinet B",
  locality: "Tiergarten Park, Berlin, Germany",
  lat: "52.5200° N",
  lng: "13.4050° E",
  accuracy: "±5m",
  specimenImage: "https://images.unsplash.com/photo-1599351581414-067649539097?auto=format&fit=crop&q=80&w=800",
  mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Location_map_Germany_Berlin.png/800px-Location_map_Germany_Berlin.png"
} }) => {
  const taxonomyFields = [
    { label: "Species Name", value: plantData.species, render: () => <i className="text-primary font-semibold">{plantData.species}</i> },
    { label: "Common Name", value: plantData.commonName },
    { label: "Family", value: plantData.family },
    { label: "Habit", value: plantData.habit },
  ];

  const collectionFields = [
    { label: "Primary Collector", value: plantData.collector, render: () => <span className="font-bold">{plantData.collector}</span> },
    { label: "Date Collected", value: plantData.date },
    { label: "Group Members", value: plantData.members, fullWidth: true },
    { label: "Collection Number", value: plantData.collectionId },
    { label: "Storage Folder", value: plantData.storage },
  ];

  return (
    <main className="flex-1 px-10 py-30 lg:px-20 max-w-360 mx-auto w-full font-display  bg-black">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            {plantData.species} <span className="text-lg font-normal text-slate-900 dark:text-white">{plantData.author}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 font-bold text-sm hover:bg-slate-50">Export PDF</button>
          <button className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-teal-700">Edit Record</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Visuals */}
        <div className="lg:col-span-5 space-y-6">
          <ImageDisplayCard imageUrl={plantData.specimenImage} />
          <LocationDisplayCard 
            lat={plantData.lat} 
            lng={plantData.lng} 
            accuracy={plantData.accuracy}
            locality={plantData.locality}
            mapUrl={plantData.mapImage}
          />
        </div>

        {/* Right: Data */}
        <div className="lg:col-span-7 space-y-6">
          <GeneralCardDetail title="Taxonomy"  fields={taxonomyFields} />
          <GeneralCardDetail title="Collection Details"  fields={collectionFields} />
          <GeneralCardDetail title="Collection Details"  fields={collectionFields} />
        </div>
      </div>
    </main>
  );
};

export default PlantDetail;