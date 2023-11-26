import { CustomSocket, io } from "./app";

io.on("connection", (socket: CustomSocket) => {
  console.log("New client connected");

  const users: { userID: string; username: string }[] = [];

  const socketsArray = Array.from(io.of("/").sockets);

  for (let [id, socket] of socketsArray) {
    users.push({
      userID: id,
      username: (socket as CustomSocket).user,
    });
    console.log(users, "uuu");
  }

  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.user,
  });

  socket.on("private-message", ({ content, to, from }) => {
    console.log("Private message received on the server:", {
      content,
      to,
      from,
    });
    socket.to(to).emit("private-message", {
      content,
      from: socket.id,
    });
  });
  // socket.on("send-message", (message) => {
  //   console.log("Message received: ", message);
  //   io.emit("receive-message", message);
  // });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
