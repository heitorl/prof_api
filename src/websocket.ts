import { CustomSocket, io } from "./app";
import messageService from "./services/message.service";

io.on("connection", (socket: CustomSocket) => {
  console.log("New client connected");

  const users: { userID: string; username: string }[] = [];

  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.user,
  });

  socket.on("private-message", ({ content, to, from }) => {
    const socketsArray = Array.from(io.of("/").sockets);

    for (let [id, socket] of socketsArray) {
      users.push({
        userID: id,
        username: (socket as CustomSocket).user,
      });
    }

    const selectedUser = users.find((user) => {
      return user.username === to;
    });

    console.log("Private message received on the server:", {
      content,
      to,
      from,
    });

    messageService.createMessage(content, to, from);

    if (selectedUser) {
      const selectedId = selectedUser.userID;

      io.to(selectedId).emit("private-message", {
        content,
        from,
      });

      // io.to(selectedId).emit(
      //   "new-message",
      //   messageService.createMessage(content, to, from)
      // );
    } else {
      console.log(`Usuário com username ${to} não encontrado.`);
    }
  });
});
