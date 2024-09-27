import React, { createContext, useContext, useEffect, useState } from "react";
import { Task } from "../types/task"; // Assuming you have a Task type defined
import * as taskService from "../lib/taskServices"; // Adjusted import to match your file structure

interface TaskContextType {
  tasks: Record<string, { name: string; data: Task[] }>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, updatedData: any) => Promise<void>;
  deleteTask: (taskId: string, column: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<
    Record<string, { name: string; data: Task[] }>
  >({
    "to-do": { name: "To Do", data: [] },
    "in-progress": { name: "In Progress", data: [] },
    completed: { name: "Completed", data: [] },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await taskService.getTasks();
      const groupedTasks: Record<string, { name: string; data: Task[] }> = {
        "to-do": { name: "To Do", data: [] },
        "in-progress": { name: "In Progress", data: [] },
        completed: { name: "Completed", data: [] },
      };

      fetchedTasks.forEach((task: Task) => {
        groupedTasks[task.status].data.push(task);
      });

      Object.keys(groupedTasks).forEach((column) => {
        groupedTasks[column].data.sort((a: any, b: any) => a.pos - b.pos || 0);
      });

      setTasks(groupedTasks);
    };
    fetchTasks();
  }, []);

  const addTask = async (task: Task) => {
    task.pos = tasks[task.status].data.length + 1;
    const createdTask = await taskService.createTask(task);
    setTasks((prev) => ({
      ...prev,
      [createdTask.status]: {
        name: prev[createdTask.status].name,
        data: [...prev[createdTask.status].data, createdTask],
      },
    }));
  };

  const updateTask = async ({
    sourceColumn,
    sourceIndex,
    destColumn,
    destIndex,
  }: any) => {
    const curTask = tasks[sourceColumn].data[sourceIndex];
    setTasks((prev) => {
      const cur = { ...prev };

      cur[sourceColumn].data.splice(sourceIndex, 1);
      cur[sourceColumn].data = cur[sourceColumn].data.map((item: any, i) =>
        i >= sourceIndex ? { ...item, pos: item.pos - 1 } : item
      );

      cur[destColumn].data = cur[destColumn].data.map((item: any, i) =>
        i >= destIndex ? { ...item, pos: item.pos + 1 } : item
      );
      cur[destColumn].data.splice(destIndex, 0, {
        ...curTask,
        status: destColumn,
        pos: destIndex,
      });

      return cur;
    });

    let updatingTask: Array<any> = [];

    if (sourceColumn !== destColumn) {
      updatingTask = [...tasks[sourceColumn].data, ...tasks[destColumn].data];
    } else {
      updatingTask = [...tasks[sourceColumn].data];
    }

    const updatedTask = await taskService.updateTask(updatingTask);
    // setTasks((prev) => {
    //   const updatedColumn = updatedTask.status;
    //   const cur = { ...prev };
    //   cur[updatedColumn].data = cur[updatedColumn].data.map((task: any) =>
    //     task.tid === updatedTask.tid ? updatedTask : task
    //   );
    //   return cur;
    // });
  };

  const deleteTask = async (taskId: string, column: string) => {
    await taskService.deleteTask(taskId);
    setTasks((prev) => ({
      ...prev,
      [column]: {
        name: prev[column].name,
        data: prev[column].data.filter((task) => task.tid !== taskId),
      },
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
