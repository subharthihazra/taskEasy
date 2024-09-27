import dotenv from "dotenv";
dotenv.config();

export const { MONGO_URI, SERVER_PORT, JWT_SECRET_KEY, REFRESH_TOKEN_SECRET } = process.env;
