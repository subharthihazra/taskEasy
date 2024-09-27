export interface Task extends Document {
    _id: string;
    title: string;
    status: "To Do" | "In Progress" | "Completed";
    createdAt: Date;
  }