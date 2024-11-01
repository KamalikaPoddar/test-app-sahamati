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
