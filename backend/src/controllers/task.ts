import { NextFunction, Request, Response } from "express";
import taskModel from "../models/tasks"; // Assuming this is the path to your task model
import { CustomError } from "../errorhandlers/CustomError";
import mongoose from "mongoose";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, tid, status } = req.body; // Get task details from request body
    const userId = req.user._id; // Get userId from req.user

    if (!title || !tid || !status) {
      return next(new CustomError(400, "Title and description are required"));
    }

    const newTask = await taskModel.create({ title, status, tid, userId }); // Create task with userId
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id; // Get userId from req.user
    const tasks = await taskModel.find({ userId }); // Find tasks associated with the user
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id; // Get userId from req.user
    const {
      tasks,
    }: {
      tasks: Array<{ title: string; pos: number; status: string; tid: string }>;
    } = req.body; // Get updated task details

    // console.log("==>>", tasks, req.body);

    // Find the task by ID and ensure it belongs to the user
    // const updatedTask = await taskModel.findOneAndUpdate(
    //   { tid, userId }, // Ensure task belongs to the user
    //   { title, status },
    //   { new: true, runValidators: true } // Return the updated document
    // );

    const updatedTasks: any = [];

    for (const task of tasks) {
      // Use aggregation to find and update the task
      const result = await taskModel.aggregate([
        {
          $match: {
            tid: task.tid,
            userId: userId, // Match by userId as well
          },
        },
        {
          $set: {
            title: task.title,
            pos: task.pos,
            status: task.status,
          },
        },
        {
          $merge: {
            into: "tasks", // Specify the target collection
            whenMatched: "merge", // Merge the fields
            whenNotMatched: "discard", // Discard if the document doesn't match
          },
        },
      ]);

      if (result.length !== 0) {
        updatedTasks.push(result);
      }
    }

    if (updateTask.length === 0) {
      return next(new CustomError(404, "Tasks not found"));
    }

    res.status(200).json({ success: true, data: updatedTasks });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { tid } = req.params; // Get the task ID from the URL
    const userId = req.user._id; // Get userId from req.user

    // Find the task by ID and ensure it belongs to the user
    const deletedTask = await taskModel.findOneAndDelete({ tid: tid, userId });

    if (!deletedTask) {
      return next(new CustomError(404, "Task not found or not authorized"));
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}
