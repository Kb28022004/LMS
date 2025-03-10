import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connect.js";
import userRouter from "./routes/userRoutes.js";
import courseRouter from './routes/courseRoutes.js'
import lectureRouter from './routes/lectureRoutes.js'
import PurchaseCourse from './routes/purchaseRoutes.js'
import courseProgressRouter from './routes/courseProgressRoutes.js'
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use("/api/v1/user", userRouter);
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/lecture',lectureRouter)
app.use('/api/v1/purchase',PurchaseCourse)
app.use('/api/v1/progress',courseProgressRouter)

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listning on the port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
