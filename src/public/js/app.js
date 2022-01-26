const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to server ✅");
});

socket.addEventListener("message", (msg) => {
    console.log(`Server said... "${msg.data}"`);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from server 🚫");
});

setTimeout(() => {
    socket.send("Hello, I'm a broweser!!");
}, 10000);