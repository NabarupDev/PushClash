const express = require('express');
const cors = require('cors');
require('dotenv').config();

const githubRoutes = require('./routes/github');
const battleRoutes = require('./routes/battle');
const roastRoutes = require('./routes/roast');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/github', githubRoutes);
app.use('/api', battleRoutes);
app.use('/api', roastRoutes);
app.use('/api', portfolioRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
