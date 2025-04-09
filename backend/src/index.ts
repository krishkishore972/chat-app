import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { addMsgToConversation } from "./controllers/msgs.controller";
import msgRouter from "./routes/msg.route";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: "GET, POST, PUT, DELETE", // Allowed methods
  })
);

app.use("/msgs", msgRouter);

const server = http.createServer(app); // Create an HTTP server

const io = new Server(server, {
  // Pass the created HTTP server here
  cors: {
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: "GET, POST, PUT, DELETE", // Allowed methods
  },
});



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
  socket.on("chat msg", (msg) => {
    if (msg && typeof msg === "object") {
      console.log("Sender:", msg.sender);
      console.log("Receiver:", msg.receiver);
      console.log("Text:", msg.text);
      const receiverSocket = userSocketMap[msg.receiver];
      if (receiverSocket) {
        receiverSocket.emit("chat msg", msg);
        console.log("Message sent to receiver:", msg.receiver);
      } else {
        console.error("Receiver socket not found");
      }
      addMsgToConversation([msg.sender, msg.receiver], {
        text: msg.text,
        sender: msg.sender,
        receiver: msg.receiver,
      }).catch((error) => {
        console.error("Failed to save message to database:", error);
      });
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
