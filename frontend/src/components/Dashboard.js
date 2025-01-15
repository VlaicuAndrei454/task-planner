import React from 'react';
import UserManagement from './UserManagement';
import TaskManagement from './TaskManagement';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskHistory from './TaskHistory';

const Dashboard = ({ role, username, onLogout }) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          Welcome, {username} ({role})
        </h1>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        {role === 'admin' && <UserManagement />}
        {role === 'manager' && (
          <>
            <TaskForm />
            <TaskManagement />
          </>
        )}
        {role === 'executing_user' && (
          <>
            <TaskList />
            <TaskHistory />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
