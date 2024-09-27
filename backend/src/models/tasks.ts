import { Schema, model, Document } from 'mongoose';

interface Task extends Document {
  title: string;
  description: string;
  completed: boolean;
  userId: string; // Add userId field to associate with a user
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<Task>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true }, // Define userId field
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const taskModel = model<Task>('Task', taskSchema);

export default taskModel;
