/* HTML Obj */
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

// WebSocket API로 객체 생성
const socket = new WebSocket(`ws://${window.location.host}`);

// 소켓 통신 Open
socket.addEventListener("open", () => {
    console.log("Connected to server ✅");
});

// message를 받았을 때
socket.addEventListener("message", (msg) => {
    console.log(`Me : "${msg.data}"`);
});

// 통신이 종료되었을 때
socket.addEventListener("close", () => {
    console.log("Disconnected from server 🚫");
});

/* Functions */
function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    
    socket.send(input.value);
    input.value = "";
}

function init() {
    messageForm.addEventListener("submit", handleSubmit);
}

/* Runtime Logic */
init();