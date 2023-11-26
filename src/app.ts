import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import registerRouters from "./routes";

interface CustomSocket extends Socket {
  user: string;
}

const app = express();

app.use(express.json());

app.use(cors());

const serverHttp = createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});

io.use((socket: CustomSocket, next) => {
  const userId = socket.handshake.auth.userId;
  console.log(userId, "userid");
  if (!userId) {
    return next(new Error("Authentication error: Missing user ID"));
  }
  socket.user = userId;

  next();
});

registerRouters(app);

app.use(cors());

export { serverHttp, io, CustomSocket };
