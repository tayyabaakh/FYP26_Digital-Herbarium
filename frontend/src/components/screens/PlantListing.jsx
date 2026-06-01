// import React, { useEffect, useState } from 'react';
// import { fetchPlants } from '../../api/api';
// import { useNavigate } from 'react-router-dom';

// const PlantsListing = () => {
//     const [plants, setPlants] = useState([]);
//     const [filteredPlants, setFilteredPlants] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//     const initialFilters = {
//         collection_folder: '', collection_no: '', collector_group_members: '',
//         collector_name: '', date: '', family: '', flower_color: '',
//         habit: '', habitat: '', locality: '', location_code: '',
//         name: '', species: '', specimen_folder: '', specimen_id_gh_number: ''
//     };

//     const [filters, setFilters] = useState(initialFilters);

//     const navigate = useNavigate();

//     // Fetch data
//     useEffect(() => {
//         const getPlantsData = async () => {
//             try {
//                 const response = await fetchPlants();
//                 const actualData = response.data || response;
//                 setPlants(actualData);
//                 setFilteredPlants(actualData);
//             } catch (error) {
//                 console.error("❌ Error:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         getPlantsData();
//     }, []);

//     // Filter Logic
//     useEffect(() => {
//         const results = plants.filter(plant => {
//             return Object.keys(filters).every(key => {
//                 if (!filters[key]) return true;
//                 return String(plant[key] || '')
//                     .toLowerCase()
//                     .includes(filters[key].toLowerCase());
//             });
//         });
//         setFilteredPlants(results);
//     }, [filters, plants]);

//     // Handlers
//     const handleFilterChange = (e) => {
//         setFilters(prev => ({
//             ...prev,
//             [e.target.name]: e.target.value
//         }));
//     };

//     const resetFilters = () => {
//         setFilters({ ...initialFilters }); // ✅ fresh object
//     };

//     if (loading) return <h2 style={{ textAlign: 'center' }}>Loading Digital Herbarium...</h2>;

//     return (
//         <div style={styles.container}>
            
//             {/* Header */}
//             <div style={styles.header}>
//                 <button
//                     style={styles.hamburger}
//                     onClick={() => setIsDrawerOpen(true)}
//                 >
//                     ☰ Filters
//                 </button>
//                 <h1 style={styles.title}>Digital Herbarium</h1>
//             </div>

//             {/* Overlay */}
//             {isDrawerOpen && (
//                 <div
//                     style={styles.overlay}
//                     onClick={() => setIsDrawerOpen(false)}
//                 />
//             )}

//             {/* Drawer */}
//             <div
//                 style={{
//                     ...styles.drawer,
//                     transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
//                     pointerEvents: isDrawerOpen ? 'auto' : 'none' // ✅ FIX
//                 }}
//             >
//                 <div style={styles.drawerHeader}>
//                     <h3>Search Filters</h3>
//                     <button
//                         onClick={() => setIsDrawerOpen(false)}
//                         style={styles.closeBtn}
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 <div style={styles.filterList}>
//                     <button onClick={resetFilters} style={styles.resetBtn}>
//                         Reset All
//                     </button>

//                     {Object.keys(filters).map((key) => (
//                         <div key={key} style={styles.inputGroup}>
//                             <label style={styles.label}>
//                                 {key.replace(/_/g, ' ')}
//                             </label>
//                             <input
//                                 name={key}
//                                 value={filters[key]}
//                                 onChange={handleFilterChange}
//                                 placeholder={`Filter by ${key}`}
//                                 style={styles.input}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Grid */}
//             <div style={styles.grid}>
//                 {filteredPlants.length > 0 ? (
//                     filteredPlants.map((plant, index) => (
//                         <div key={index} style={styles.card}>
//                             <div>
//                                 <span style={styles.tag}>🌿 {plant.family}</span>
//                                 <h2 style={styles.plantName}>{plant.name}</h2>
//                                 <p style={styles.scientificName}>
//                                     <i>{plant.species}</i>
//                                 </p>
//                             </div>

//                             <div style={styles.imageBox}>
//                                 <img
//                                     src={
//                                         plant.image_url ||
//                                         "https://via.placeholder.com/300x150?text=No+Image"
//                                     }
//                                     alt={plant.name}
//                                     style={styles.img}
//                                 />
//                             </div>

//                             <div style={styles.cardBody}>
//                                 <p><strong>Locality:</strong> {plant.locality}</p>
//                                 <p><strong>Collector:</strong> {plant.collector_name}</p>
//                             </div>

//                             <button
//                                 style={styles.button}
//                                 onClick={() =>
//                                     navigate(`/plant-details/${plant.specimen_id_gh_number}`)
//                                 }
//                             >
//                                 View Record
//                             </button>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No plants match your filters.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// // ✅ Styles
// const styles = {
//     container: {
//         padding: '40px 5%',
//         backgroundColor: '#f1f5f9',
//         minHeight: '100vh'
//     },

//     header: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '20px',
//         marginBottom: '20px',
//         position: 'relative',
//         zIndex: 2000 // ✅ ensures clickable
//     },

//     hamburger: {
//         padding: '10px 20px',
//         backgroundColor: '#0f766e',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         fontWeight: 'bold'
//     },

//     title: {
//         color: '#1e293b'
//     },

//     overlay: {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         zIndex: 999
//     },

//     drawer: {
//         position: 'fixed',
//         top: 0,
//         right: 0,
//         height: '100vh',
//         width: '320px',
//         backgroundColor: 'white',
//         zIndex: 1000,
//         transform: 'translateX(100%)',
//         transition: 'transform 0.3s ease',
//         boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
//         padding: '20px',
//         overflowY: 'auto'
//     },

//     drawerHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderBottom: '1px solid #ddd',
//         marginBottom: '15px'
//     },

//     closeBtn: {
//         background: 'none',
//         border: 'none',
//         fontSize: '20px',
//         cursor: 'pointer'
//     },

//     filterList: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '10px'
//     },

//     inputGroup: {
//         display: 'flex',
//         flexDirection: 'column'
//     },

//     label: {
//         fontSize: '12px',
//         fontWeight: 'bold',
//         color: '#475569',
//         marginBottom: '4px'
//     },

//     input: {
//         padding: '8px',
//         borderRadius: '4px',
//         border: '1px solid #cbd5e1'
//     },

//     resetBtn: {
//         padding: '10px',
//         backgroundColor: '#ef4444',
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         fontWeight: 'bold'
//     },

//     grid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//         gap: '25px'
//     },

//     card: {
//         backgroundColor: '#fff',
//         border: '1px solid #e2e8f0',
//         borderRadius: '8px',
//         padding: '20px',
//         display: 'flex',
//         flexDirection: 'column'
//     },

//     tag: {
//         color: '#0f766e',
//         fontSize: '11px',
//         fontWeight: 'bold'
//     },

//     plantName: {
//         fontSize: '20px',
//         margin: '10px 0 5px 0'
//     },

//     scientificName: {
//         fontSize: '14px',
//         color: '#64748b'
//     },

//     imageBox: {
//         height: '150px',
//         backgroundColor: '#f8fafc',
//         borderRadius: '6px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: '15px'
//     },

//     img: {
//         maxWidth: '100%',
//         maxHeight: '100%',
//         objectFit: 'cover'
//     },

//     cardBody: {
//         flex: 1,
//         fontSize: '13px'
//     },

//     button: {
//         marginTop: '20px',
//         padding: '10px',
//         backgroundColor: '#0f766e',
//         color: '#fff',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer'
//     }
// };

// export default PlantsListing;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlants } from '../../api/api'; // Ensure this path is correct
import Header from '../commons/Header/Header';
import SpecimenCard from '../commons/PlantListing/specimancard';
import LoadingScreen from '../commons/Loader/Loader';

export default function PlantsListing() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const initialFilters = {
        collection_folder: '', collection_no: '', collector_group_members: '',
        collector_name: '', date: '', family: '', flower_color: '',
        habit: '', habitat: '', locality: '', location_code: '',
        name: '', species: '', specimen_folder: '', specimen_id_gh_number: ''
    };
  const [filters, setFilters] = useState(initialFilters);

  // 1. Fetch Data
  useEffect(() => {
    const getPlantsData = async () => {
      try {
        const response = await fetchPlants();
        const actualData = response.data || response;
        setPlants(actualData);
        setFilteredPlants(actualData);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };
    getPlantsData();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    const results = plants.filter(plant => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true;
        return String(plant[key] || '').toLowerCase().includes(filters[key].toLowerCase());
      });
    });
    setFilteredPlants(results);
  }, [filters, plants]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => setFilters({ ...initialFilters });

  if (loading) return <LoadingScreen/>;

  return (
    <div className="font-body-md text-on-background min-h-screen pb-24 bg-gradient-to-br from-neutral-950 via-emerald-950 to-neutral-950">
      {/* <Header  onMenuToggle={() => setIsDrawerOpen(true)} /> */}
   

      {/* Filter Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Filter Drawer */}
      <div className={`fixed bg-amber-50 top-0 right-0 h-full w-80 bg-surface-container z-[110] p-6 shadow-2xl transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold">Search Filters</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-on-background">✕</button>
        </div>
        
        <button onClick={resetFilters} className="w-full py-2 mb-6 bg-error text-on-error rounded font-bold">Reset All</button>

        <div className="space-y-4 overflow-y-auto max-h-[80vh]">
          {Object.keys(initialFilters).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-xs font-bold uppercase text-on-surface-variant mb-1">{key.replace(/_/g, ' ')}</label>
              <input
                name={key}
                value={filters[key]}
                onChange={handleFilterChange}
                placeholder={`Filter by ${key}`}
                className="bg-surface-dim border border-outline rounded p-2 text-on-background"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-[1440px] mx-auto">
    <section className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
  {/* Left Side: Text Details */}
  <div>
    <h1 className="text-4xl font-bold uppercase mb-2 text-amber-50">Botanical Records</h1>
    <p className="text-on-tertiary-container text-amber-50">Showing {filteredPlants.length} specimens.</p>
  </div>

  {/* Right Side: Filter Button */}
  <button 
    onClick={() => setIsDrawerOpen(true)} 
    className="flex mr-15 bg-amber-50 items-center gap-2 text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-container transition shrink-0 w-full sm:w-auto justify-center sm:justify-start"
  >
    <span>☰</span> Filters
  </button>
</section>
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlants.map((plant) => (
              <div key={plant.specimen_id_gh_number} onClick={() => navigate(`/plant-details/${plant.specimen_id_gh_number}`)}>
                <SpecimenCard 
                  title={plant.name} 
                  type={plant.family} 
                  collector={plant.collector_name} 
                  locality={plant.locality} 
                  img={plant.image_url || "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400"} 
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white mt-20 text-on-surface-variant">No plants match your filters.</p>
        )}
      </main>
    </div>
  );
}