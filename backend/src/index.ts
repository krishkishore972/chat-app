import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
const server = http.createServer(app); // Create an HTTP server

const io = new Server(server, {
  // Pass the created HTTP server here
  cors: {
    allowedHeaders: ["*"],
    origin: "*",
  },
});

io.on("connection" , (socket) => {
  console.log("A user is connected", socket.id);
  // Event listener for receiving messages
  socket.on("chat message", (msg) => {
    console.log(`Received message :${msg}`);
    // Broadcasting message to all clients
      socket.broadcast.emit("chat msg", msg);
  });

  socket.on("disconnect" , () => {
    console.log(`user disconnected : ${socket.id}`);
  })
})

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
  // Use `server.listen` instead of `app.listen`
  console.log(`Listening on port ${PORT}`);
});
