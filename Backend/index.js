const express = require('express');
const cors = require('cors');
require('dotenv').config();

const githubRoutes = require('./routes/github');
const battleRoutes = require('./routes/battle');
const roastRoutes = require('./routes/roast');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://pushclash.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Mount routes
app.use('/github', githubRoutes);
app.use('/api', battleRoutes);
app.use('/api', roastRoutes);
app.use('/api', portfolioRoutes);

app.get('/', (req, res) => {
  res.send('PushClash backend is working!');
});

app.get('/api/wake', (req, res) => {
  res.status(200).json({ status: 'Server is awake' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
