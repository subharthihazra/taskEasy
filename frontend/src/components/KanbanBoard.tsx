"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
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

interface Task {
  id: string;
  title: string;
}

interface Tasks {
  [key: string]: { name: string; data: Task[] };
}

const initialTasks: Tasks = {
  "to-do": {
    name: "To Do",
    data: [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ],
  },
  "in-progress": { name: "In Progress", data: [{ id: "3", title: "Task 3" }] },
  completed: { name: "Completed", data: [{ id: "4", title: "Task 4" }] },
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("to-do");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceColumn = result.source.droppableId;
    const destColumn = result.destination.droppableId;
    const sourceTasks = [...tasks[sourceColumn].data];
    const [removed] = sourceTasks.splice(result.source.index, 1);

    if (sourceColumn === destColumn) {
      sourceTasks.splice(result.destination.index, 0, removed);
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: { name: tasks[sourceColumn].name, data: sourceTasks },
      }));
    } else {
      const destTasks = [...tasks[destColumn].data];
      destTasks.splice(result.destination.index, 0, removed);
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: { name: tasks[sourceColumn].name, data: sourceTasks },
        [destColumn]: { name: tasks[destColumn].name, data: destTasks },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const newTask = { id: Date.now().toString(), title, status };
      setTasks((prev) => ({
        ...prev,
        [status]: { name: tasks[status].name, data: [...prev[status].data,newTask] },
      }));
      setTitle("");
      setIsOpen(false);
    }
  };

  const openDialog = (column: string) => {
    setStatus(column); // Set the status to the current column
    setIsOpen(true); // Open the dialog
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row p-4 justify-center gap-4">
          {Object.keys(tasks).map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col w-full md:w-1/3 bg-slate-50 border border-slate-300 p-4 rounded box-border h-fit"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {column.replace("-", " ")}
                  </h2>
                  {tasks[column].data.map((task: Task, index: number) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-white rounded shadow border border-slate-300"
                        >
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
                        <DialogTitle>Add New Task</DialogTitle>
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
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to-do">To Do</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="mt-4 flex justify-end">
                          <Button type="submit">Add Task</Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="ml-2"
                          >
                            Cancel
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
