import { authApiClient } from "./apiClient";

// Create a new task
export const createTask = async (taskData: any): Promise<any> => {
  try {
    const response = await authApiClient.post("/tasks", taskData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error creating task");
  }
};

// Get all tasks
export const getTasks = async (): Promise<any> => {
  try {
    const response = await authApiClient.get("/tasks");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching tasks");
  }
};

// Update a task by ID
export const updateTask = async (tasks: any): Promise<any> => {
  try {
    const response = await authApiClient.put(`/tasks`, { tasks });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error updating task");
  }
};

// Delete a task by ID
export const deleteTask = async (taskId: any): Promise<any> => {
  try {
    const response = await authApiClient.post(`/tasks/${taskId}`, {});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error deleting task");
  }
};
