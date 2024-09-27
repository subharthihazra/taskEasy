import apiClient from './apiClient';

// Create a new task
export const createTask = async (taskData: any): Promise<any> => {
  try {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Error creating task');
  }
};

// Get all tasks
export const getTasks = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/tasks');
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Error fetching tasks');
  }
};

// Update a task by ID
export const updateTask = async (taskId: any, taskData: any): Promise<any> => {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Error updating task');
  }
};

// Delete a task by ID
export const deleteTask = async (taskId: any): Promise<any> => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || 'Error deleting task');
  }
};
