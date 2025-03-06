import React from 'react';
import { 
  FaClock, FaCheck, FaTrash, FaEdit, 
  FaBriefcase, FaShoppingBag, FaHeartbeat, 
  FaGraduationCap, FaUser
} from 'react-icons/fa';
import './TaskList.css';

const TaskCard = ({ task }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work':
        return <FaBriefcase />;
      case 'shopping':
        return <FaShoppingBag />;
      case 'health':
        return <FaHeartbeat />;
      case 'education':
        return <FaGraduationCap />;
      case 'personal':
      default:
        return <FaUser />;
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className={`category category-${task.category}`}>
          {getCategoryIcon(task.category)}
          <span>{task.category}</span>
        </div>
        <div className={`priority priority-${task.priority}`}></div>
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      
      <div className="task-date">
        <FaClock />
        <span>{formatDate(task.dueDate)}</span>
      </div>
      
      <div className="task-actions">
        <button className="task-action-btn complete-btn">
          <FaCheck />
        </button>
        <button className="task-action-btn edit-btn">
          <FaEdit />
        </button>
        <button className="task-action-btn delete-btn">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
