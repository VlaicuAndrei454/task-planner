import React, { useEffect, useState } from 'react';
import { getTaskHistory } from '../api'; // Adjust the path to where `api.js` is located
import './TaskHistory.css'; // Import CSS for styling

const TaskHistory = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getTaskHistory(); // Fetch closed tasks from the backend
                setTasks(data); // Update the state with fetched tasks
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching task history:', err.message);
                setError('Failed to fetch task history. Please try again.');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div className="loading">Loading task history...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="task-history">
            <h2>Task History</h2>
            {tasks.length === 0 ? (
                <div className="alert alert-info">No closed tasks available.</div>
            ) : (
                <ul className="task-list">
                    {tasks.map((task) => (
                        <li key={task._id} className="task-item">
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-description">{task.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskHistory;
