import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api' // This matches your backend port
});

export const fetchPlants = async () =>{

    try{
        const response = API.get('/plants');
        console.log("API response is", response);
        
        return response;

    }
    catch(err){
        console.log("the error is this:",err);
        
    }   
} 

export const fetchPlantById = async (plantId) =>{

    try{
        const response = API.get(`/plants/${plantId}`);
        console.log("API response is", response.data);
        
        return response;

    }
    catch(err){
        console.log("the error is this:",err);
        
    }   
} 



    






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