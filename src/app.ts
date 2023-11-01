import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import registerRouters from "./routes";

const app = express();

app.use(express.json())

app.use(cors());

const serverHttp = createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "http://localhost:3030",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

registerRouters(app)

app.use(cors());


export {serverHttp, io}