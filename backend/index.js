const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
// NEW CORS CONFIGURATION
const corsOptions = {
  origin: [
    'http://localhost:3000', // for local testing
    'https://social-orbit-frontend-zeta.vercel.app' // YOUR LIVE VERCEL URL
  ],
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));app.use(express.json()); // Allows us to parse JSON in requests

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error(err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// We will add the real routes below later...

// ... (all the code from before)

// === ADD THIS ===
// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// === END ADD ===

