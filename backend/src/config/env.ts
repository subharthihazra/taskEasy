import dotenv from "dotenv";
dotenv.config();

export const { MONGO_URI, SERVER_PORT } = process.env;
