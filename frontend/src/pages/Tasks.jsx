import React, { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import { useTaskContext } from '../context/TaskContext';
import '../styles/Tasks.css';

const Tasks = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  
  // Filter tasks based on category and search
  useEffect(() => {
    let result = [...tasks];
    
    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(task => task.category === filterCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filterCategory, searchQuery]);
  
  const handleAddTask = async (taskData) => {
    try {
      await addTask(taskData);
      setIsModalOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  const handleEditTask = async (taskData) => {
    try {
      await updateTask(currentTask._id, taskData);
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  
  const handleToggleComplete = async (id) => {
    try {
      await toggleTaskCompletion(id);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };
  
  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <button className="btn-primary add-task-btn" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Add Task
        </button>
      </div>
      
      <div className="tasks-filters">
        <div className="search-bar">
          <FaSearch />
          <input 
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown">
          <FaFilter />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>
      
      <div className="tasks-summary">
        <p>Showing {filteredTasks.length} of {tasks.length} tasks</p>
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onEdit={openEditModal} 
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      )}
      
      {isModalOpen && (
        <TaskForm 
          task={currentTask}
          onSave={currentTask ? handleEditTask : handleAddTask}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Tasks;
