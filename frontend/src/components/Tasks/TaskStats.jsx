import React from 'react';

const TaskStats = ({ stats }) => {
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <section className="progress-container">
      <h2>Task Completion</h2>
      
      <div className="progress-stats">
        <div className="progress-stat">
          <p className="progress-stat-value">{completionPercentage}%</p>
          <p className="progress-stat-label">Completion Rate</p>
        </div>
        
        <div className="progress-stat">
          <p className="progress-stat-value">{stats.completed}</p>
          <p className="progress-stat-label">Completed Tasks</p>
        </div>
        
        <div className="progress-stat">
          <p className="progress-stat-value">{stats.pending}</p>
          <p className="progress-stat-label">Pending Tasks</p>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
    </section>
  );
};

export default TaskStats;
