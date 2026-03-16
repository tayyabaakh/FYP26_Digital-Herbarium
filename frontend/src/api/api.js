import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api' // This matches your backend port
});

export const fetchPlants = () => API.get('/plants');