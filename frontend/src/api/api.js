

import axios from "axios";

const API = axios.create({
    // baseURL: import.meta.env.VITE_API_URL || "https://fyp26-digital-herbarium.onrender.com/api/plants"
     baseURL: "http://localhost:4000/api/plants" 
});
// 1. Individual named exports (fixes the SyntaxError in PlantsListing)
export const fetchPlants = async () => {
    const response = await API.get("/");
    console.log("API Response:", response); // Debugging log
    return response.data;
};

export const fetchPlantById = async (id) => {
    const response = await API.get(`/${id}`);
    return response.data;
};

// 2. Service object export (for your PlantDetail page logic)
export const plantdetailService = {
    getAllPlants: fetchPlants,
    getPlantsById: fetchPlantById
};


