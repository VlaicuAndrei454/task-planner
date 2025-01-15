const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Manager creates a task
router.post('/', authenticateToken, authorizeRole('manager'), async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      managerId: req.user.id, // Associate task with the logged-in manager
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// Manager assigns a task to a user
router.patch('/:id/assign', authenticateToken, authorizeRole('manager'), async (req, res) => {
  const { assignedUserId } = req.body;

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Assign user and update status
    task.assignedUserId = assignedUserId;
    task.status = 'PENDING';
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error('Error assigning task:', err);
    res.status(500).json({ message: 'Error assigning task', error: err.message });
  }
});

// Admin deletes all tasks
router.delete('/deleteAll', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await Task.destroy({ where: {} }); // Delete all tasks
    res.status(200).json({ message: 'All tasks deleted successfully', result });
  } catch (err) {
    console.error('Error deleting tasks:', err);
    res.status(500).json({ message: 'Failed to delete tasks', error: err.message });
  }
});

// Manager fetches tasks they created
router.get('/', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { managerId: req.user.id } }); // Fetch tasks created by the manager
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Get tasks assigned to the logged-in executing user
router.get('/mytasks', authenticateToken, authorizeRole('executing_user'), async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { assignedUserId: req.user.id } }); // Fetch tasks assigned to the user
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Mark a task as completed by the executing user
router.patch('/:id/complete', authenticateToken, authorizeRole('executing_user'), async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, assignedUserId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not assigned to you' });
    }

    // Update task status to COMPLETED
    task.status = 'COMPLETED';
    await task.save();

    res.status(200).json({ message: 'Task marked as completed', task });
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ message: 'Error completing task', error: err.message });
  }
});

// Mark a COMPLETED task as CLOSED (Manager Only)
router.put('/close/:id', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the task exists
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task is COMPLETED
    if (task.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Task must be COMPLETED to be CLOSED' });
    }

    // Update the status to CLOSED
    task.status = 'CLOSED';
    await task.save();

    res.status(200).json({ message: 'Task marked as CLOSED successfully', task });
  } catch (error) {
    console.error('Error closing task:', error);
    res.status(500).json({ message: 'An error occurred while closing the task' });
  }
});

// Fetch closed tasks for Task History
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // Fetch tasks assigned to the logged-in user with status "CLOSED"
    const closedTasks = await Task.findAll({
      where: {
        assignedUserId: req.user.id, // Filter by the logged-in user's ID
        status: 'CLOSED', // Ensure only closed tasks are retrieved
      },
    });

    res.status(200).json(closedTasks);
  } catch (error) {
    console.error('Error fetching task history:', error);
    res.status(500).json({ message: 'Failed to fetch task history' });
  }
});



module.exports = router;
