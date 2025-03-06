import React from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };
  
  const getCategoryLabel = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-status" onClick={() => onToggleComplete(task._id)}>
            {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
          </div>
          
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
              <span className="task-category">
                {getCategoryLabel(task.category)}
              </span>
              <span className="task-due-date">
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
          
          <div className="task-actions">
            <button 
              className="edit-btn" 
              onClick={() => onEdit(task)}
              title="Edit Task"
            >
              <FaEdit />
            </button>
            <button 
              className="delete-btn" 
              onClick={() => onDelete(task._id)}
              title="Delete Task"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
