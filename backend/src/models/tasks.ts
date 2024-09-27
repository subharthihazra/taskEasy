import { Schema, model, Document } from "mongoose";
import { Task } from "types/task";

const taskSchema = new Schema(
  {
    tid: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, required: true, default: "To Do" },
    pos: { type: Number },
    userId: { type: Schema.Types.ObjectId, required: true }, // Define userId field
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const taskModel = model<Task>("Task", taskSchema);

export default taskModel;
