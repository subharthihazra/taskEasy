import { NextFunction, Request, Response } from 'express';
import taskModel from '../models/tasks'; // Assuming this is the path to your task model
import { CustomError } from '../errorhandlers/CustomError';

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description } = req.body; // Get task details from request body
    const userId = req.user._id; // Get userId from req.user

    if (!title || !description) {
      return next(new CustomError(400, "Title and description are required"));
    }

    const newTask = await taskModel.create({ title, description, userId }); // Create task with userId
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user._id; // Get userId from req.user
    const tasks = await taskModel.find({ userId }); // Find tasks associated with the user
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}


export async function updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // Get the task ID from the URL
      const userId = req.user._id; // Get userId from req.user
      const { title, description, completed } = req.body; // Get updated task details
  
      // Find the task by ID and ensure it belongs to the user
      const updatedTask = await taskModel.findOneAndUpdate(
        { _id: id, userId }, // Ensure task belongs to the user
        { title, description, completed },
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedTask) {
        return next(new CustomError(404, "Task not found or not authorized"));
      }
  
      res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
      next(error);
    }
  }
  
  export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // Get the task ID from the URL
      const userId = req.user._id; // Get userId from req.user
  
      // Find the task by ID and ensure it belongs to the user
      const deletedTask = await taskModel.findOneAndDelete({ _id: id, userId });
  
      if (!deletedTask) {
        return next(new CustomError(404, "Task not found or not authorized"));
      }
  
      res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
