const express = require('express');
require('dotenv').config();

const cors = require('cors');
const plantRoutes = require('./routes/plantRoutes');

const app = express();

// server.js
app.use(cors({
  origin: [
    // 'https://fyp-26-digital-herbarium-doo8.vercel.app'|| 
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plants', plantRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));