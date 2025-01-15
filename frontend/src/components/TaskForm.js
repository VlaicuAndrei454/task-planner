import React, { useState } from 'react';
import { createTask } from '../api';
import './TaskForm.css'; // Import the CSS file for styling

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTask({ title, description });
      setSuccess('Task created successfully!');
      setError(null); // Clear any previous errors
      setTitle('');
      setDescription('');
      setTimeout(() => setSuccess(null), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
      setError('Failed to create task. Please try again.');
      setSuccess(null); // Clear any previous success messages
    }
  };

  return (
    <div className="task-form-container">
      <h2>Create Task</h2>

      {/* Success and Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
