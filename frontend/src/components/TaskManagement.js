import React, { useEffect, useState } from 'react';
import { getTasks, assignTask, getUsers, closeTask } from '../api'; // API functions
import './TaskManagement.css'; // Import a CSS file for custom styling

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
      setError(null); // Clear errors on success
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
      setError('Failed to fetch tasks. Please try again.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const executingUsers = response.data.filter((user) => user.role === 'executing_user');
      setUsers(executingUsers);
      setError(null); // Clear errors on success
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      setError('Failed to fetch users. Please try again.');
    }
  };

  const handleAssignTask = async () => {
    try {
      await assignTask(selectedTaskId, selectedUserId);
      setSuccess('Task assigned successfully!');
      setError(null); // Clear errors on success
      fetchTasks(); // Refresh the task list
      setSelectedTaskId('');
      setSelectedUserId('');
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error assigning task:', error.response?.data || error.message);
      setError('Failed to assign task. Please try again.');
      setSuccess(null); // Clear success messages
    }
  };

  const handleCloseTask = async (taskId) => {
    try {
      await closeTask(taskId);
      setSuccess('Task marked as CLOSED successfully!');
      setError(null); // Clear errors on success
      fetchTasks(); // Refresh the task list
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error closing task:', error.response?.data || error.message);
      setError('Failed to close task. Please try again.');
      setSuccess(null); // Clear success messages
    }
  };

  return (
    <div className="task-management">
      <h2>Manage Tasks</h2>

      {/* Success and Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Assign Task Section */}
      <div className="assign-task">
        <h3>Assign Task</h3>
        <div className="form-group">
          <label htmlFor="task">Task:</label>
          <select
            id="task"
            onChange={(e) => setSelectedTaskId(e.target.value)}
            value={selectedTaskId}
          >
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title} - {task.status}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="user">User:</label>
          <select
            id="user"
            onChange={(e) => setSelectedUserId(e.target.value)}
            value={selectedUserId}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAssignTask}
          disabled={!selectedTaskId || !selectedUserId}
        >
          Assign Task
        </button>
      </div>

      {/* Task List with "Mark as Closed" Button */}
      <div className="task-list">
        <h3>Task List</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <strong>{task.title}</strong> - {task.status} - Assigned to: {task.assignedUserId || 'None'}
              {task.status === 'COMPLETED' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCloseTask(task.id)}
                >
                  Mark as Closed
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskManagement;
