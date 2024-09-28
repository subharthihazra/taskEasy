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
import { useTaskContext } from "@/context/TaskContext";

const TaskList = () => {
  const { tasks, addTask, updateATask, deleteTask } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("to-do");
  const [filterStatus, setFilterStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Handle Task Creation or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && editTaskId) {
      // Edit Task
      updateATask({
        title,
        status,
        tid: editTaskId,
        pos:
          tasks[status].data.filter((x) => x.tid === editTaskId).length === 0
            ? tasks[status].data.length
            : tasks[status].data.filter((x) => x.tid === editTaskId).at(0)?.pos,
      });
    } else {
      // Add New Task
      const newTask: any = {
        tid: Date.now().toString(),
        title,
        status,
        pos: tasks[status].data.length + 1,
      }; // Add user ID if needed
      await addTask(newTask);
    }
    resetDialog();
  };

  // Handle Task Deletion
  const handleDelete = (tid: string) => {
    deleteTask(tid);
  };

  // Open the Dialog for Editing a Task
  const openEditDialog = (task: any) => {
    setTitle(task.title);
    setStatus(task.status);
    setIsDialogOpen(true);
    setEditMode(true);
    setEditTaskId(task.tid);
  };

  // Reset the Dialog State
  const resetDialog = () => {
    setIsDialogOpen(false);
    setTitle("");
    setEditMode(false);
    setEditTaskId(null);
  };

  // Filter Tasks Based on Status
  const filteredTasks = filterStatus
    ? tasks[filterStatus].data
    : Object.keys(tasks)
        .map((column) => tasks[column].data)
        .flat(1);

  return (
    <div className="p-4 mt-[70px] flex flex-col gap-4 sm:max-w-[800px] mx-auto">
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
              <SelectItem value="to-do">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.tid}
              className="flex justify-between items-center p-3 border border-slate-300 rounded"
            >
              <div>
                <h2 className="font-medium">{task.title}</h2>
                <p className="text-sm text-gray-600">{tasks[task.status].name}</p>
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
                  onClick={() => handleDelete(task.tid)}
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
            <Button onClick={() => setIsDialogOpen(true)}>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Task" : "Add Task"}</DialogTitle>
              <DialogDescription>
                {editMode
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
                  <SelectItem value="to-do">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
