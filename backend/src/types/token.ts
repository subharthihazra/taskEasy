import { Request } from "express";
import User from "./user";

export interface DataStoredInToken {
  _id: string;
  email: string;
}

export interface TokenData {
  token: string;
  name: string;
  expiresIn: number | string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface DataStoredInAdminToken {
  username: string;
}

export interface TokenModel extends Document {
  _id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}
