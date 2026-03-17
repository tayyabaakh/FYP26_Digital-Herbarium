import React, { useEffect, useState } from 'react';
// Import the same working function you used in App.jsx
import { fetchPlants } from '../../../api/api'; 

const PlantsListing = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlantsData = async () => {
      try {
        console.log("--- Fetching via api.js ---");
        // Use your working function here
        const response = await fetchPlants(); 
        
        console.log("Full Response from api.js:", response);

        // In your App.jsx you used: const { data } = await fetchPlants();
        // So we extract 'data' here too.
        const actualData = response.data || response;

        console.log("Extracted Data:", actualData);
        setPlants(actualData);
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getPlantsData();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading Cards...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Digital Herbarium</h1>
      <div style={styles.grid}>
        {/* Check if it's an array before mapping */}
        {Array.isArray(plants) ? plants.map((plant, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.tag}>🌿 {plant.family}</span>
              <h2 style={styles.plantName}>{plant.name}</h2>
              <p style={styles.scientificName}><i>{plant.species}</i></p>
            </div>

          <div style={styles.imageBox}>
  <img 
    src={plant.image_url || "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400"} 
    alt={plant.name} 
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '4px'
    }}
    // This fallback runs if the dummy link ever breaks
    onError={(e) => { e.target.src = "https://via.placeholder.com/300x150?text=No+Specimen+Image"; }}
  />
</div>

            <div style={styles.cardBody}>
              <p><strong>Locality:</strong> {plant.locality}</p>
              <p><strong>ID:</strong> {plant.specimen_id_gh_number}</p>
            </div>
            <button style={styles.button}>View Record</button>
          </div>
        )) : (
          <p>Data received is not an array. Check console.</p>
        )}
      </div>
    </div>
  );
};

// Use the same styles as before
const styles = {
  container: { padding: '40px 5%', backgroundColor: '#f1f5f9', minHeight: '100vh' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' },
  title: { marginBottom: '30px', color: '#1e293b' },
  tag: { color: '#0f766e', fontSize: '11px', fontWeight: 'bold' },
  plantName: { fontSize: '20px', margin: '10px 0 5px 0' },
  scientificName: { fontSize: '14px', color: '#64748b' },
  imageBox: { height: '150px', backgroundColor: '#f8fafc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', border: '1px dashed #cbd5e1' },
  cardBody: { flex: 1, fontSize: '13px' },
  button: { marginTop: '20px', padding: '10px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default PlantsListing;