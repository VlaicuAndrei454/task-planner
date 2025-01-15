import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL
});

// Attach Authorization Token to Requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserDetails = () => api.get('/auth/me');


// User APIs
export const createUser = (user) => api.post('/users', user); // Create a new user
export const getUsers = () => api.get('/users'); // Fetch all users
export const loginUser = (username) => api.post('/auth/login', { username }); // Login user

// Task APIs
export const createTask = (task) => api.post('/tasks', task); // Create a new task
export const assignTask = (taskId, userId) =>
  api.patch(`/tasks/${taskId}/assign`, { assignedUserId: userId }); // Assign a task to a user
export const getMyTasks = () => api.get('/tasks/mytasks'); // Fetch tasks assigned to the logged-in user
export const completeTask = (taskId) => api.patch(`/tasks/${taskId}/complete`); // Mark a task as completed
export const getTasks = () => api.get('/tasks'); // Fetch all tasks for managers/admins
export const closeTask = (taskId) => api.put(`/tasks/close/${taskId}`); // Close a completed task

// Task History APIs
export const getTaskHistory = async () => {
  try {
    const response = await api.get('/tasks/history'); // Use the `api` instance
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task history');
  }
};



export default api;
