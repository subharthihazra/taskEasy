"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { CirclePlus, Trash, Edit2 } from "lucide-react";
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
} from "@/components/ui/select"; // Updated imports for Select
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { useTaskContext } from "../context/TaskContext"; // Import the task context

const KanbanBoard = () => {
  const { tasks, addTask, updateTasks, updateATask, deleteTask } =
    useTaskContext(); // Access tasks and context functions
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("to-do");
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceColumn = result.source.droppableId;
    const sourceIndex = result.source.index;
    const destColumn = result.destination.droppableId;
    const destIndex = result.destination.index;

    // console.log(result);

    updateTasks({ sourceColumn, sourceIndex, destColumn, destIndex });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (editMode && editTaskId) {
        updateATask({ title, status, tid: editTaskId });
      } else {
        const newTask: any = { tid: Date.now().toString(), title, status }; // Add user ID if needed
        await addTask(newTask); // Use context function to add task
      }
      setTitle("");
      setEditTaskId(null);
      setEditMode(false);
      setIsOpen(false);
    }
  };

  const openDialog = (column: string, task: any = null) => {
    if (task) {
      // If editing, populate the form with task details
      setTitle(task.title);
      setStatus(task.status);
      setEditTaskId(task.tid);
      setEditMode(true);
    } else {
      // Otherwise, open dialog for adding a new task
      setTitle("");
      setStatus(column);
      setEditTaskId(null);
      setEditMode(false);
    }
    setIsOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    deleteTask(taskId); // Use context function to delete task
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col sm:flex-row gap-4 overflow-auto min-h-screen pt-[87px] px-4 pb-4">
          {Object.keys(tasks).map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col w-full sm:w-1/3 bg-slate-50 border border-slate-300 py-4 px-6 rounded box-border h-fit sm:min-w-[250px] sm:max-w-[600px]"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {tasks[column].name}
                  </h2>
                  {tasks[column].data.map((task: any, index: number) => (
                    <Draggable
                      key={task.tid}
                      draggableId={task.tid}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="py-3 px-6 mb-2 bg-white rounded shadow border border-slate-300 relative"
                        >
                          <div className="flex flex-col gap-2 w-8 absolute left-0 top-1/2 translate-y-[-50%] translate-x-[-50%]">
                            {/* Edit Button */}
                            <Button
                              variant="outline"
                              onClick={() => openDialog(column, task)}
                              className="text-blue-500 hover:text-blue-700 px-2 h-8 rounded-full shadow"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-col gap-2 w-8 absolute right-0 top-1/2 translate-y-[-50%] translate-x-[50%]">
                            {/* Delete Button */}
                            <Button
                              variant="outline"
                              onClick={() => handleDelete(task.tid)}
                              className="text-red-500 hover:text-red-700 px-2 h-8 rounded-full shadow"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                          {task.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <div
                        className="mt-2 w-fit h-fit p-1 ml-auto rounded-full cursor-pointer"
                        onClick={() => openDialog(column)} // Open dialog with the current column
                      >
                        <CirclePlus className="h-6 w-6 text-gray-700 hover:text-gray-900" />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editMode ? "Update the Task" : "Add New Task"}</DialogTitle>
                        <DialogDescription>
                          Please enter the task details below.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                      >
                        <Input
                          type="text"
                          placeholder="Task Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                        {!editMode && (
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="to-do">To Do</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editMode ? "Update Task" : "Add Task"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;
