const socket = io("http://localhost:3000/");

const messages = document.getElementById("messages");
const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let message = messageInput.value;
    socket.emit("send-message", message);
    messageInput.value = "";
});

createNewMessage = (message) => {
    const newMessage = document.createElement("div");
    newMessage.textContent = message;

    messages.append(newMessage);
}

socket.on("chat-message", data => {
    createNewMessage(data);
})