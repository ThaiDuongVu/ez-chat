const socket = io("http://localhost:3000/");

const title = document.getElementById("title");

const messages = document.getElementById("messages");

const form = document.getElementById("send-form");
const messageInput = document.getElementById("message-input");

const changeNameButton = document.getElementById("change-name-button");

let userName = "";

// Let the browser speak the message
speakMessage = (message) => {
    let speech = new SpeechSynthesisUtterance();
    
    speech.text = message;
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

// Create a new text element to display the received message
appendReceivedMessage = (message) => {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message-received");
    newMessage.textContent = message;

    const speakButton = document.createElement("button");
    speakButton.textContent = "Speak";

    messages.append(newMessage);
    messages.append(speakButton);
    speakButton.addEventListener("click", () => {
        speakMessage(message);
    });
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

    title.textContent = "Your current user name is: " + name;    
    socket.emit("new-user", name);
}

// Change the user name
changeUserName = () => {
    let oldName = name;
    name = prompt("What's your name?");
    appendSentMessage("You changed your name to: " + name);

    socket.emit("user-change-name", {oldName: oldName, newName: name});
}

// Send a message to the server
sendMessage = (user) => {
    if (user.message === "") {
        return;
    }

    socket.emit("send-message", user);
    messageInput.value = "";

    appendSentMessage("You: " + user.message);
}

// Ask for name when page load
setUserName();

// When user choose a name that is already taken
socket.on("overlapping-name", (name) => {
    alert("Name " + name + " is already taken!");

    appendSentMessage("But that name is already taken");
    setUserName();
});

// Change name button
changeNameButton.addEventListener("click", () => {
    changeUserName();
});

// When user update to an already taken name
socket.on("overlapping-update-name", (names) => {
    alert("Name " + names.newName + " is already taken");

    appendSentMessage("But that name is already taken");
    changeUserName();
});

// When send button is pressed
form.addEventListener("submit", (event) => {
    event.preventDefault();

    sendMessage({name: name, message: messageInput.value});    
});

// When receive a new message
socket.on("chat-message", (user) => {
    appendReceivedMessage(user.name + ": " + user.message);
})

// When a new user is connected
socket.on("user-connected", (users) => {
    appendReceivedMessage(users[users.length - 1] + " joined");
});

// When a user name is updated
socket.on("update-name", (names) => {
    appendReceivedMessage(names.oldName + " changed his/her name to: " + names.newName);
});

// When a user is disconnected
socket.on("user-disconnected", (name) => {
    appendReceivedMessage(name + " disconnected");
});