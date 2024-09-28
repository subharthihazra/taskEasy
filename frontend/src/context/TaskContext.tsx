import React, { createContext, useContext, useEffect, useState } from "react";
import { Task } from "../types/task"; // Assuming you have a Task type defined
import * as taskService from "../lib/taskServices"; // Adjusted import to match your file structure

interface TaskContextType {
  tasks: Record<string, { name: string; data: Task[] }>;
  addTask: (task: Task) => Promise<void>;
  updateATask: (task: any) => Promise<void>;
  updateTasks: (info: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
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

  const updateTasks = async ({
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

    await taskService.updateTask(updatingTask);
  };

  const updateATask = async (task: any) => {
    setTasks((prev) => {
      const cur = { ...prev };

      
    //   cur[task.status].data = cur[task.status].data.map((item) =>
    //     item.tid !== task.tid ? item : { ...item, ...task, pos:item.status === task.status ? pos: prev[] }
    //   );

      return cur;
    });

    await taskService.updateTask([task]);
  };

  const deleteTask = async (tid: string) => {
    setTasks((prev) => {
      const cur = { ...prev };
      Object.keys(cur).forEach((column: any) => {
        cur[column].data = cur[column].data.filter((item) => item.tid !== tid);
      });
      return cur;
    });
    await taskService.deleteTask(tid);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTasks, deleteTask, updateATask }}
    >
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
