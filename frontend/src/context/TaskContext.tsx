"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
}

interface TaskContextProps {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const { data } = await apiClient.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const createTask = async (task: Partial<Task>) => {
    const { data } = await apiClient.post('/tasks/create', task);
    setTasks([...tasks, data]);
  };

  const updateTask = async (task: Task) => {
    const { data } = await apiClient.put(`/tasks/${task._id}`, task);
    setTasks(tasks.map(t => (t._id === data._id ? data : t)));
  };

  const deleteTask = async (taskId: string) => {
    await apiClient.delete(`/tasks/${taskId}`);
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
