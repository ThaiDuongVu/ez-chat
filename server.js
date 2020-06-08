const PORT = 3000 || process.env.PORT;
const socketio = require("socket.io")(PORT);

let numberOfUsers = 0;

// When a connection is made
socketio.on("connection", socket => {
    // When a send message event is received
    socket.on("send-message", (user) => {
        socket.broadcast.emit("chat-message", user);
    })

    socket.on("new-user", (name) => {
        socket.broadcast.emit("user-connected", name);
        numberOfUsers++;
    });
});