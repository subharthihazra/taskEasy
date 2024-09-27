export interface Task extends Document {
    _id: string;
    tid: string;
    pos?: number;
    title: string;
    status: "To Do" | "In Progress" | "Completed";
    createdAt: Date;
  }