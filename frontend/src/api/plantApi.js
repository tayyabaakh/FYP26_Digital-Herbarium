import axiosInstance from "./api";

// 1. Individual named exports (fixes the SyntaxError in PlantsListing)
export const fetchPlants = async () => {
    const response = await axiosInstance.get("/plants");
    console.log("axiosInstance Response:", response); // Debugging log
    return response.data;
};

export const fetchPlantById = async (id) => {
    const response = await axiosInstance.get(`/plants/${id}`);
    return response.data;
};

// 2. Service object export (for your PlantDetail page logic)
export const plantdetailService = {
    getAllPlants: fetchPlants,
    getPlantsById: fetchPlantById
};

// 2. Herbarium Database API Endpoints
export const fetchHerbariumRecords = async (params = {}) => {
    const response = await axiosInstance.get("/herbarium", { params });
    console.log("Herbarium API Response:", response.data);
    return response.data;
};
// Example in plantApi.js
export const updateHerbariumRecord = async (id, formData) => {
    const response = await axiosInstance.put(`/herbarium/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // Include your auth token if needed:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};