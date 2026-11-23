// frontend/src/botanicalLoader.js
import botanicalData from '../botanicalData.json';

// Safely handle both direct arrays and default-wrapped JSON imports
export const botanicalFamilies = Array.isArray(botanicalData) 
  ? botanicalData 
  : (botanicalData.default || []);

export const getTotalStats = () => ({
  totalFamilies: botanicalFamilies.length,
  totalGenera: botanicalFamilies.reduce((acc, f) => acc + (f.generaCount || 0), 0),
  totalSpecies: botanicalFamilies.reduce((acc, f) => acc + (f.speciesCount || 0), 0)
});