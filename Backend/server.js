// const express = require('express');
// require('dotenv').config();

// const cors = require('cors');
// const plantRoutes = require('./routes/plantRoutes');

// const app = express();

// // server.js
// app.use(cors({
//   origin: [
//     // 'https://fyp-26-digital-herbarium-doo8.vercel.app'
//     'http://localhost:5173'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// // app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/plants', plantRoutes);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    // 'https://fyp-26-digital-herbarium-doo8.vercel.app'
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Flora-Digitalis API running',
  });
});

// Routes
const plantRoutes = require('./routes/plantRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});