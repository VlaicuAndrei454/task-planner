const express = require('express');
const Task = require('../models/Task');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// User's task history
router.get('/tasks/history', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assigned_user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task history', error: err });
  }
});

// Manager views task history for a user
router.get('/tasks/history/:userId', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const tasks = await Task.find({ assigned_user: req.params.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task history', error: err });
  }
});

module.exports = router;