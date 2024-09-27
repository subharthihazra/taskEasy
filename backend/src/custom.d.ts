import User from "./types/user";

declare global {
  namespace Express {
    export interface Request {
      user: User;
      body: any;
    }
  }
}
