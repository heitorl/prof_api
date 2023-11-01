import { io } from "./app";

io.on("connection", socket => {
  console.log('New client connected');

  // evento para receber mensagens do cliente
  socket.on('send-message', (message) => {
    console.log('Message received: ', message);

    // enviar mensagem para outros clientes conectados
    io.emit('receive-message', message);
  });

  // disconectar o cliente
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
})