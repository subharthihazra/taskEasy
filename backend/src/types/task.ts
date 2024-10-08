export interface Task extends Document {
    _id: string;
    tid: string;
    title: string;
    pos?: number;
    status: "To Do" | "In Progress" | "Completed";
    createdAt: Date;
    userId: string
  }