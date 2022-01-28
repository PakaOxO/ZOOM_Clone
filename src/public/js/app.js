/* HTML Obj */
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");


const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to server ✅");
});

socket.addEventListener("message", (msg) => {
    console.log(`Me : "${msg.data}"`);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from server 🚫");
});


function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    
    socket.send(input.value);
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);