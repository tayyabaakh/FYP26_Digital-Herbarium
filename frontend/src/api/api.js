// import axios from 'axios';

// const API = axios.create({
//     baseURL: 'http://localhost:5000/api' // This matches your backend port
// });

// export const fetchPlants = () => API.get('/plants');


import axios from "axios";

const API = axios.create({
    baseURL: 'https://fyp26-digital-herbarium.onrender.com/api/plants' || "http://localhost:5000/api"
});
// 1. Individual named exports (fixes the SyntaxError in PlantsListing)
export const fetchPlants = async () => {
    const response = await API.get("/");
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


// import axios from "axios";


// export const plantdetailService = {
    
//     getAllPlants: async() => {
//         try{
//             const response = await axios.get("/plantdetails")
//             return response.data
//         }
//         catch(error){
//             console.error("Error loading plants", error.response?.data || error.message);
//             throw error;
//         }

//     },

//     getPlantsById: async(plantId) => {
//         try{
//             const response = await axios.get(`/plantdetails/${plantId}`)
//             return response.data
//         }
//         catch(error){
//             console.error("Error loading plant by ID", error.response?.data || error.message);
//             throw error;

//         }
//     }


// }