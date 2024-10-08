import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SERVER_PORT } from "./config/env";
import ErrorMiddleware from "./errorhandlers/ErrorMiddleware";
import authRouter from "./routes/auth";
import taskRouter from "./routes/task";
import connectDB from "./db/connect";

const app: Express = express();

// use CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
// parse cookie
app.use(cookieParser());

//auth router
app.use("/api", authRouter);

//task router
app.use("/api", taskRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// ERROR middleware (must be in last)
app.use(ErrorMiddleware);

const startServer = async () => {
  try {
    await connectDB();

    const port = String(SERVER_PORT) || 5000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port} ...`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
