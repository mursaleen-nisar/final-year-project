import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import TaskService from '../services/task.service';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    // Don't attempt to fetch if no user is logged in
    if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const response = await TaskService.getAllTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Initial fetch
  useEffect(() => {
    if (currentUser) {
        fetchTasks();
    } else {
        setTasks([]);
        setError(null);
    }
  }, [currentUser, fetchTasks]);

  // Add a new task
  const addTask = async (taskData) => {
    try {
      const response = await TaskService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, response.data]);
      toast.success('Task added successfully!');
      return response.data;
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
      throw err;
    }
  };

  // Update a task
  const updateTask = async (id, taskData) => {
    try {
      const response = await TaskService.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? response.data : task
        )
      );
      toast.success('Task updated successfully!');
      return response.data;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await TaskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      throw err;
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id) => {
    try {
      const response = await TaskService.toggleTaskCompletion(id);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === id ? response.data : task
        )
      );
      toast.success(`Task marked as ${response.data.completed ? 'completed' : 'incomplete'}`);
      return response.data;
    } catch (err) {
      console.error('Error toggling task completion:', err);
      toast.error('Failed to update task status');
      throw err;
    }
  };

  // Get tasks by category
  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  // Get upcoming tasks (due in the next 7 days)
  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek && !task.completed;
    });
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && !task.completed;
    });
  };

  // Get completed tasks
  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const overdue = getOverdueTasks().length;
    const upcoming = getUpcomingTasks().length;
    
    return {
      total,
      completed,
      overdue,
      upcoming,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByCategory,
        getUpcomingTasks,
        getOverdueTasks,
        getCompletedTasks,
        getTaskStats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
