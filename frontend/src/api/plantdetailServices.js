import axios from "axios";


export const plantdetailService = {
    
    getAllPlants: async() => {
        try{
            const response = await axios.get("/plantdetails")
            return response.data
        }
        catch(error){
            console.error("Error loading plants", error.response?.data || error.message);
            throw error;
        }

    },

    getPlantsById: async(plantId) => {
        try{
            const response = await axios.get(`/plantdetails/${plantId}`)
            return response.data
        }
        catch(error){
            console.error("Error loading plant by ID", error.response?.data || error.message);
            throw error;

        }
    }


}