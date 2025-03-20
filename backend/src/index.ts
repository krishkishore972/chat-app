import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
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

interface ChatMessage {
  sender: string;
  receiver: string;
  text: string;
}

interface SocketMap {
  [username: string]: Socket;
}
const userSocketMap: SocketMap = {};

io.on("connection", (socket: Socket) => {
  console.log("A user is connected", socket.id);

  // Get username from query params
  const username = socket.handshake.query.username;
  const usernameStr = Array.isArray(username) ? username[0] : username;
  console.log(`Username: ${usernameStr}`);

  // Store socket reference
  if (usernameStr) {
    userSocketMap[usernameStr] = socket;
  }

  // Event listener for receiving messages
  socket.on("chat message", (msg) => {
    if (msg && typeof msg === "object") {
      console.log("Sender:", msg.sender);
      console.log("Receiver:", msg.receiver);
      console.log("Text:", msg.text);

      // Forward message to receiver if they're online
      if (msg.receiver && userSocketMap[msg.receiver]) {
        userSocketMap[msg.receiver].emit("chat message", msg);
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove user from socket map
    if (usernameStr) {
      delete userSocketMap[usernameStr];
    }
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
  // Use `server.listen` instead of `app.listen`
  console.log(`Listening on port ${PORT}`);
});
