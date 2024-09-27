"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Edit } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: string;
}

const initialTasks: Task[] = [
  { id: "1", title: "Task 1", status: "To Do" },
  { id: "2", title: "Task 2", status: "In Progress" },
  { id: "3", title: "Task 3", status: "Completed" },
];

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("To Do");
  const [filterStatus, setFilterStatus] = useState("");

  // Handle Task Creation or Update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTask) {
      // Edit Task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === currentTask.id ? { ...task, title, status } : task
        )
      );
    } else {
      // Add New Task
      const newTask = { id: Date.now().toString(), title, status };
      setTasks((prev) => [...prev, newTask]);
    }
    resetDialog();
  };

  // Handle Task Deletion
  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // Open the Dialog for Editing a Task
  const openEditDialog = (task: Task) => {
    setCurrentTask(task);
    setTitle(task.title);
    setStatus(task.status);
    setIsDialogOpen(true);
  };

  // Reset the Dialog State
  const resetDialog = () => {
    setIsDialogOpen(false);
    setCurrentTask(null);
    setTitle("");
    setStatus("To Do");
  };

  // Filter Tasks Based on Status
  const filteredTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks;

  return (
    <div className="p-4 space-y-4">
      {/* Task Filtering */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div>
          <Select
            value={filterStatus}
            onValueChange={(value) =>
              setFilterStatus(value == "All" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center p-3 border border-slate-300 rounded"
            >
              <div>
                <h2 className="font-medium">{task.title}</h2>
                <p className="text-sm text-gray-600">{task.status}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => openEditDialog(task)}
                  className="px-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(task.id)}
                  className="px-2"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      {/* Add Task Button */}
      <div className="text-right">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentTask ? "Edit Task" : "Add Task"}
              </DialogTitle>
              <DialogDescription>
                {currentTask
                  ? "Update the task details below."
                  : "Please enter the details of the new task."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2">
                <Button type="submit">Save Task</Button>
                <Button variant="outline" onClick={resetDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskList;
