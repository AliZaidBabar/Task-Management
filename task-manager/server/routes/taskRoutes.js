const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

// Define authentication middleware
const authMiddleware = (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token is required' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token.split(' ')[1], 'fvgbhnjm345678bh');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Create task
router.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const task = new Task({ title, description, status, user: req.user._id });
    await task.save();

    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all tasks
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update task
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findOneAndUpdate({ _id: id, user: req.user._id }, { title, description, status }, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete task
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
