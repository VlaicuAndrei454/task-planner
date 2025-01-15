const sequelize = require('./config');
const User = require('../models/User');
const Task = require('../models/Task');

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite database.');

    // Sync models with the database
    await sequelize.sync({ force: true }); // Drops and recreates tables
    console.log('Database synchronized.');

    // Seed initial data (optional)
    const admin = await User.create({ username: 'admin', role: 'admin' });
    const manager = await User.create({ username: 'manager_user', role: 'manager' });
    const user = await User.create({ username: 'executing_user', role: 'executing_user' });

    await Task.create({
      title: 'Sample Task',
      description: 'This is a sample task.',
      managerId: manager.id,
      assignedUserId: user.id,
    });

    console.log('Sample data added.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};

initializeDatabase();
