const socket = io("http://localhost:3000/");

const messages = document.getElementById("messages");
const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");

const title = document.getElementById("title");

let userName;

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
    appendSentMessage("You joined as " + name);

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

// Ask name when page load
setUserName();

// When send button is pressed
form.addEventListener("submit", (event) => {
    event.preventDefault();

    sendMessage({name: name, message: messageInput.value});    
});

// When receive a new message
socket.on("chat-message", (user) => {
    appendReceivedMessage(user.name + ": " + user.message);
})

socket.on("user-connected", (name) => {
    appendReceivedMessage(name + " joined");
    title.textContent = "You're chatting with " + name;
});