const { Server } = require("socket.io");

function setupSocket(server) {
  //const RETURN_URL = process.env.REACT_APP_RETURN_URL;
  const io = new Server(server, {
    cors: {
      // origin: `http://localhost:3000`,
      origin: `${process.env.FRONTEND_URL}`,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
      io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;
