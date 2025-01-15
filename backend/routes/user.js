const express = require('express');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin creates a user
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { username, role } = req.body;

  try {
    if (!username || !role) {
      return res.status(400).json({ message: 'Username and role are required' });
    }

    // Create the user in the database
    const newUser = await User.create({ username, role });
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Fetch all users (accessible by managers and admins)
router.get('/', authenticateToken, authorizeRole('manager', 'admin'), async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;
