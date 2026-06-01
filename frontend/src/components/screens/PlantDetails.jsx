import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPlantById } from '../../api/api';
import ImageDisplayCard from '../commons/ImageDetailCard/ImageDetailCard';
import LocationDisplayCard from '../commons/LocationDisplayCard/LocationDisplayCard';
import GeneralCardDetail from '../commons/GeneralCardDetail/GeneralCardDetail';
import LoadingScreen from '../commons/Loader/Loader';

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
  <LoadingScreen/>
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
    <main className="min-h-screen bg-surface text-slate-200 font-sans bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950">
    
    {/* Remove 'mt-40', fix 'md:row', and ensure proper sticky positioning */}
<header className="border-b border-white/10 bg-surface backdrop-blur-md sticky top-[64px] z-40 px-6 py-6 shadow-sm">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    
    <div className="flex items-center gap-4">
      <div className="h-10 w-1 bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white  italic">
          {plant.name} <span className="text-gray-500 font-light not-italic ml-2 capitalize">{plant.species}</span>
        </h1>
        <p className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest mt-1">
          Archive Ref: {plant.specimen_id_gh_number}
        </p>
      </div>
    </div>


  </div>
</header>

      <div className="max-w-7xl mx-auto p-6 lg:p-10  mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Specimen Visualization */}
          <div className="lg:col-span-5 space-y-8">
            <ImageDisplayCard imageUrl={plant.image_url} />
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