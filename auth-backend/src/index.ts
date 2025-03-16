import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


//routes
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.routes"


dotenv.config();
const port = process.env.PORT || 8000;


const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE", // Allowed methods
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

app.use("/auth",authRouter);
app.use("/users",userRouter);



app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
