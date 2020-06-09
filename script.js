const socket = io("http://localhost:3000/");

const messages = document.getElementById("messages");
const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");
const changeNameButton = document.getElementById("change-name-button");

const title = document.getElementById("title");

let userName = "";

// Create a new text element to display the received message
appendReceivedMessage = (message) => {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message-received");
    newMessage.textContent = message;

    messages.append(newMessage);
}

// Create a new text element to display the sent message
appendSentMessage = (message) => {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message-sent");
    newMessage.textContent = message;

    messages.append(newMessage);
}

// Ask the user for name and display it
setUserName = () => {
    name = prompt("What's your name?");
    appendSentMessage("You joined as: " + name);

    socket.emit("new-user", name);
}

// Send a message to the server
sendMessage = (user) => {
    if (user.message === "") {
        return;
    }

    socket.emit("send-message", user);
    messageInput.value = "";

    appendSentMessage(user.message);
}

// Ask for name when page load
setUserName();

// When send button is pressed
form.addEventListener("submit", (event) => {
    event.preventDefault();

    sendMessage({name: name, message: messageInput.value});    
});

changeNameButton.addEventListener("click", () => {
    let oldName = name;
    name = prompt("What's your name?");
    appendSentMessage("You changed your name to: " + name);

    socket.emit("user-change-name", {oldName: oldName, newName: name});
});

// When receive a new message
socket.on("chat-message", (user) => {
    appendReceivedMessage(user.name + ": " + user.message);
})

socket.on("user-connected", (users) => {
    appendReceivedMessage(users[users.length - 1] + " joined");
    title.textContent = "You're chatting with: " + users[users.length - 1];
});

socket.on("update-name", (names) => {
    appendReceivedMessage(names.oldName + " changed his/her name to: " + names.newName);
    title.textContent = "You're chatting with: " + names.newName;
})