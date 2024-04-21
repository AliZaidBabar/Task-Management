const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

// Database connection
mongoose.connect("mongodb://127.0.0.1/taskmanager", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err.message));
