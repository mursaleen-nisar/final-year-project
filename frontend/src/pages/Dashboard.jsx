import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useTaskContext } from '../context/TaskContext';
import { FaTasks, FaCheckCircle, FaExclamationCircle, FaClock, FaSun, FaMoon } from 'react-icons/fa';
import TaskList from '../components/Tasks/TaskList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { 
    tasks, 
    loading, 
    error, 
    getTaskStats,
  } = useTaskContext();
  
  // Get real stats from TaskContext
  const stats = getTaskStats();
  
  // Get high priority tasks
  const highPriorityTasks = tasks.filter(task => task.priority === "high" && !task.completed);
  
  // Get recent tasks (last 5 created or updated)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);

  if (loading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }
  
  return (
    <div className="dashboard-container">
      <header className='dashboard-header'>
        <h1>Dashboard</h1>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>
      
      <section className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <FaTasks />
          </div>
          <div className="stat-details">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheckCircle />
          </div>
          <div className="stat-details">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-details">
            <h3>Upcoming</h3>
            <p className="stat-value">{stats.upcoming}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon high-priority">
            <FaExclamationCircle />
          </div>
          <div className="stat-details">
            <h3>Overdue</h3>
            <p className="stat-value">{stats.overdue}</p>
          </div>
        </div>
      </section>
      
      <section className="progress-container">
        <h2>Progress Overview</h2>
        <div className="progress-stats">
          <div className="progress-stat">
            <p className="progress-stat-value">{stats.completionRate}%</p>
            <p className="progress-stat-label">Completion Rate</p>
          </div>
          <div className="progress-stat">
            <p className="progress-stat-value">{stats.total - stats.completed}</p>
            <p className="progress-stat-label">Tasks Remaining</p>
          </div>
          <div className="progress-stat">
            <p className="progress-stat-value">{highPriorityTasks.length}</p>
            <p className="progress-stat-label">High Priority</p>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </section>
      
      <section className="recent-tasks">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="btn-primary">View All</Link>
        </div>
        {recentTasks.length > 0 ? (
          <TaskList tasks={recentTasks} />
        ) : (
          <p>No tasks created yet. Create your first task!</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
