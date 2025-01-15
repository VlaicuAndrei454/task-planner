const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'OPEN',
  },
});

// Define relationships
Task.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedUserId' });

module.exports = Task;
