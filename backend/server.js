const express = require('express');
const cors = require('cors');
const sequelize = require('./db/config'); // Sequelize configuration
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Sequelize Initialization and Default Admin Creation
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log('Connected to SQLite database.');

    // Sync models with the database
    await sequelize.sync({ alter: true }); // Use alter: true to adjust schema without dropping data
    console.log('Database synchronized.');

    // Create default admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({ username: 'admin', role: 'admin' });
      console.log('Default admin created.');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

initializeDatabase(); // Call the initialization function

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
