import React, { useEffect, useState } from 'react';
import { getMyTasks, completeTask } from '../api'; // API functions

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const response = await getMyTasks(); // Fetch tasks assigned to the logged-in user
      const openTasks = response.data.filter((task) => task.status !== 'CLOSED'); // Exclude closed tasks
      setTasks(openTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
    }
  };

  const markAsCompleted = async (taskId) => {
    try {
      await completeTask(taskId); // Mark task as completed
      fetchMyTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error marking task as completed:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you at this moment.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.description}</p>
              <p className="card-text">
                <strong>Status:</strong> {task.status}
              </p>
              {task.status === 'PENDING' && (
                <button
                  className="btn btn-success"
                  onClick={() => markAsCompleted(task.id)}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
