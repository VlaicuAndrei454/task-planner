import React, { useState, useEffect } from 'react';
import { getUsers, createUser } from '../api';
import './UserManagement.css'; // Import a CSS file for custom styling

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      setError('Failed to fetch users. Please try again.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser({ username, role });
      setSuccess('User created successfully!');
      setError(null); // Clear any previous errors
      fetchUsers(); // Refresh the user list
      setUsername('');
      setRole('');
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to create user. Please try again.');
      setSuccess(null); // Clear any previous success messages
    }
  };

  return (
    <div className="user-management">
      <h2>Manage Users</h2>

      {/* Success and Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* User Creation Form */}
      <form onSubmit={handleCreateUser} className="user-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="manager">Manager</option>
            <option value="executing_user">Executing User</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create User
        </button>
      </form>

      {/* User List */}
      <h3>User List</h3>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <strong>{user.username}</strong> - {user.role || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
