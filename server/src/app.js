import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";

//import routes
import userRoutes from "./routes/user.js";

const app = express();
const corsOptions = {
  origin: ["http://localhost:4600", "https://instaclone-self-six.vercel.app"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions)); //allows external origin points to communicate with server
app.use(morgan("dev")); //log https requests to terminal
app.use(json({ limit: "25mb" })); //parses requests to client side in json body format
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by"); //disable tech stack

//home server route
app.get("/", (req, res) => {
  res.send("Hello Instashots server");
});

//api
app.use("/api/auth", userRoutes);

//handle route errors
app.use((req, res, next) => {
  return next(createHttpError(404, `Route ${req.originalUrl} not found`));
});

//handle specifc app errors
app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "Internal Server Error";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: error.message });
});

export default app;
