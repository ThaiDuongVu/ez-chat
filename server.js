const PORT = 3000;// || process.env.PORT;
const socketio = require("socket.io")(PORT);

socketio.on("connection", socket => {
    socket.on("send-message", (message) => {
        socket.broadcast.emit("chat-message", message);
    })
});