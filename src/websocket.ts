import { io } from "./app";

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("send-message", (message) => {
    console.log("Message received: ", message);

    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
