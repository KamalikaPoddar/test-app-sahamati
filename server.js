require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const { sequelize, ApiResponse } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Validate environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'ENCRYPTION_KEY'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`${varName} is not set in the environment variables`);
    process.exit(1);
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Function to make the API call and store the response of the sahamati secret
async function refreshToken() {
  try {
    const response = await axios.post('https://api.sandbox.sahamati.org.in/iam/v1/user/token/generate', 
      new URLSearchParams({
        'username': process.env.API_USERNAME,
        'password': process.env.API_PASSWORD
      }),
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Store the API response in the database
    await ApiResponse.create({
      endpoint: '/iam/v1/user/token/generate',
      request_data: JSON.stringify({
        username: process.env.API_USERNAME,
        password: '********' // Mask the password for security
      }),
      response_data: JSON.stringify(response.data)
    });

    console.log('Token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing token:', error.message);
  }
}

// Schedule the token refresh to run every 24 hours
cron.schedule('0 0 * * *', () => {
  console.log('Running token refresh task...');
  refreshToken();
});

// Initial token refresh on server start
refreshToken();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
