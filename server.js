const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const PORT = 3000 || process.env.PORT;
const io = require("socket.io")(server);

// A list of user names
let users = [];
let idNames = {};

// When a connection is made
io.on("connection", socket => {

    // When a new user is connected
    socket.on("new-user", (name) => {
        let overlapName = false;

        // Check if chosen name is already taken
        users.forEach(user => {
            if (name === user) {
                socket.emit("overlapping-name", name);
                overlapName = true;
                return;
            }
        });

        if (!overlapName) {
            users.push(name);
            idNames[socket.id] = name;

            socket.broadcast.emit("user-connected", users);
        }
    });

    // When a send message event is received
    socket.on("send-message", (user) => {
        socket.broadcast.emit("chat-message", user);
    })

    // When a user change their user name
    socket.on("user-change-name", (names) => {
        let overlapName = false;

        // Check if changed name is already taken
        users.forEach(user => {
            if (names.newName === user) {
                overlapName = true;
                socket.emit("overlapping-update-name", names);
                return;
            }
        });

        if (!overlapName) {
            socket.broadcast.emit("update-name", names);
        
            idNames[socket.id] = names.newName;
            
            for (let i = 0; i < users.length; i++) {
                if (users[i] === names.oldName) {
                    users[i] = names.newName;
                }
            }
        }
    });

    // When a user is disconnected
    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", idNames[socket.id]);
    });
});

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(PORT);