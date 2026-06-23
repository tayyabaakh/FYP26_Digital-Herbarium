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
