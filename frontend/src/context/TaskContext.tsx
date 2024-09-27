// context/taskContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTask, getTasks, updateTask, deleteTask } from '../lib/taskServices';

interface TaskContextType {
  tasks: any[];
  createNewTask: (taskData: any) => Promise<void>;
  updateExistingTask: (taskId: any, taskData: any) => Promise<void>;
  removeTask: (taskId: any) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const createNewTask = async (taskData: any) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateExistingTask = async (taskId: any, taskData: any) => {
    try {
      const updatedTask = await updateTask(taskId, taskData);
      setTasks((prevTasks) => 
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const removeTask = async (taskId: any) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, createNewTask, updateExistingTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
