// authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const secretKey = 'fvgbhnjm345678bh';

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.isValidPassword(password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      role: user.role,
      username: user.username,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Function to generate JWT token
function generateToken(user) {
  const payload = {
    user: {
      id: user.id,
    },
    role: user.role,
  };

  return jwt.sign(payload, secretKey, { expiresIn: '10y' });
}

module.exports = router;
