const express = require('express');
require('dotenv').config();

const cors = require('cors');
const plantRoutes = require('./routes/plantRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plants', plantRoutes);

// --- CHANGES START HERE ---

// For Local Development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;