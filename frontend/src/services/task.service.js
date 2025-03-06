import api from './api';

const TaskService = {
  getAllTasks: async () => {
    return await api.get('/api/tasks');
  },
  
  getTaskById: async (id) => {
    return await api.get(`/api/tasks/${id}`);
  },
  
  createTask: async (taskData) => {
    return await api.post('/api/tasks', taskData);
  },
  
  updateTask: async (id, taskData) => {
    return await api.put(`/api/tasks/${id}`, taskData);
  },
  
  deleteTask: async (id) => {
    return await api.delete(`/api/tasks/${id}`);
  },
  
  toggleTaskCompletion: async (id) => {
    return await api.put(`/api/tasks/${id}/toggle`);
  }
};

export default TaskService;
