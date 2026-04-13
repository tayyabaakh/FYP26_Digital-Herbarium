import React, { useEffect, useState } from 'react';
import { fetchPlants } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const PlantsListing = () => {
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const initialFilters = {
        collection_folder: '', collection_no: '', collector_group_members: '',
        collector_name: '', date: '', family: '', flower_color: '',
        habit: '', habitat: '', locality: '', location_code: '',
        name: '', species: '', specimen_folder: '', specimen_id_gh_number: ''
    };

    const [filters, setFilters] = useState(initialFilters);

    const navigate = useNavigate();

    // Fetch data
    useEffect(() => {
        const getPlantsData = async () => {
            try {
                const response = await fetchPlants();
                const actualData = response.data || response;
                setPlants(actualData);
                setFilteredPlants(actualData);
            } catch (error) {
                console.error("❌ Error:", error);
            } finally {
                setLoading(false);
            }
        };
        getPlantsData();
    }, []);

    // Filter Logic
    useEffect(() => {
        const results = plants.filter(plant => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return String(plant[key] || '')
                    .toLowerCase()
                    .includes(filters[key].toLowerCase());
            });
        });
        setFilteredPlants(results);
    }, [filters, plants]);

    // Handlers
    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const resetFilters = () => {
        setFilters({ ...initialFilters }); // ✅ fresh object
    };

    if (loading) return <h2 style={{ textAlign: 'center' }}>Loading Digital Herbarium...</h2>;

    return (
        <div style={styles.container}>
            
            {/* Header */}
            <div style={styles.header}>
                <button
                    style={styles.hamburger}
                    onClick={() => setIsDrawerOpen(true)}
                >
                    ☰ Filters
                </button>
                <h1 style={styles.title}>Digital Herbarium</h1>
            </div>

            {/* Overlay */}
            {isDrawerOpen && (
                <div
                    style={styles.overlay}
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                style={{
                    ...styles.drawer,
                    transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
                    pointerEvents: isDrawerOpen ? 'auto' : 'none' // ✅ FIX
                }}
            >
                <div style={styles.drawerHeader}>
                    <h3>Search Filters</h3>
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        style={styles.closeBtn}
                    >
                        ✕
                    </button>
                </div>

                <div style={styles.filterList}>
                    <button onClick={resetFilters} style={styles.resetBtn}>
                        Reset All
                    </button>

                    {Object.keys(filters).map((key) => (
                        <div key={key} style={styles.inputGroup}>
                            <label style={styles.label}>
                                {key.replace(/_/g, ' ')}
                            </label>
                            <input
                                name={key}
                                value={filters[key]}
                                onChange={handleFilterChange}
                                placeholder={`Filter by ${key}`}
                                style={styles.input}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={styles.grid}>
                {filteredPlants.length > 0 ? (
                    filteredPlants.map((plant, index) => (
                        <div key={index} style={styles.card}>
                            <div>
                                <span style={styles.tag}>🌿 {plant.family}</span>
                                <h2 style={styles.plantName}>{plant.name}</h2>
                                <p style={styles.scientificName}>
                                    <i>{plant.species}</i>
                                </p>
                            </div>

                            <div style={styles.imageBox}>
                                <img
                                    src={
                                        plant.image_url ||
                                        "https://via.placeholder.com/300x150?text=No+Image"
                                    }
                                    alt={plant.name}
                                    style={styles.img}
                                />
                            </div>

                            <div style={styles.cardBody}>
                                <p><strong>Locality:</strong> {plant.locality}</p>
                                <p><strong>Collector:</strong> {plant.collector_name}</p>
                            </div>

                            <button
                                style={styles.button}
                                onClick={() =>
                                    navigate(`/plant-details/${plant.specimen_id_gh_number}`)
                                }
                            >
                                View Record
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No plants match your filters.</p>
                )}
            </div>
        </div>
    );
};

// ✅ Styles
const styles = {
    container: {
        padding: '40px 5%',
        backgroundColor: '#f1f5f9',
        minHeight: '100vh'
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 2000 // ✅ ensures clickable
    },

    hamburger: {
        padding: '10px 20px',
        backgroundColor: '#0f766e',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    title: {
        color: '#1e293b'
    },

    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999
    },

    drawer: {
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '320px',
        backgroundColor: 'white',
        zIndex: 1000,
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
        padding: '20px',
        overflowY: 'auto'
    },

    drawerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        marginBottom: '15px'
    },

    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer'
    },

    filterList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },

    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },

    label: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: '4px'
    },

    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #cbd5e1'
    },

    resetBtn: {
        padding: '10px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px'
    },

    card: {
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
    },

    tag: {
        color: '#0f766e',
        fontSize: '11px',
        fontWeight: 'bold'
    },

    plantName: {
        fontSize: '20px',
        margin: '10px 0 5px 0'
    },

    scientificName: {
        fontSize: '14px',
        color: '#64748b'
    },

    imageBox: {
        height: '150px',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '15px'
    },

    img: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover'
    },

    cardBody: {
        flex: 1,
        fontSize: '13px'
    },

    button: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#0f766e',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default PlantsListing;