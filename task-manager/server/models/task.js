const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
