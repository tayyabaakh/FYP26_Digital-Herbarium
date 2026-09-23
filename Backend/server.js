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
const pool = require('./config/db');

// WITH THIS:
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();

dotenv.config();
const path = require('path');
const app = express();
// Middleware
app.use(cors({
  origin: [
    'https://fyp-26-digital-herbarium-s1tc.vercel.app'
    // 'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// In your backend server file:
app.use('/uploads', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow React app frontend to read image details
  next();
}, express.static(path.join(__dirname, 'uploads')));

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
// const submissionRoutes = require("./routes/submissionRoutes");

const submissionRoutes = require('./routes/submissionRoutes');

app.use('/api/submissions', submissionRoutes);

const herbariumRoutes = require('./routes/herbariumRoutes');

app.use('/api/herbarium', herbariumRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/botanist", dashboardRoutes);

app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
// app.use("/api/submissions", submissionRoutes);

// 1. Import your AI routes file
const aiRoutes = require("./routes/aiRoutes"); // Adjust path if needed

// 2. Mount it under '/api'
app.use("/api", aiRoutes);


// server.js
const profileRoutes = require("./routes/profileRoutes");
// Ensure the path matches '/api/profile'
app.use('/api/profile', profileRoutes);

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