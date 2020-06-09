const path = require("path");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const PORT = 3000 || process.env.PORT;
const socketio = require("socket.io")(server);

let users = [];

// When a connection is made
socketio.on("connection", socket => {
    // When a new user is connected
    socket.on("new-user", (name) => {
        users.push(name);
        socket.broadcast.emit("user-connected", users);
    });

    // When a send message event is received
    socket.on("send-message", (user) => {
        socket.broadcast.emit("chat-message", user);
    })

    socket.on("user-change-name", (names) => {
        socket.broadcast.emit("update-name", names);

        for (let i = 0; i < users.length; i++) {
            if (users[i] === names.oldName) {
                users[i] = names.newName;
            }
        }
    });
});

app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(PORT);